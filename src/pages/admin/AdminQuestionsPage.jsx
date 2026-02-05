import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import QuestionEffectsDetail from "../../components/SectionAdmin/QuestionEffectsDetail.jsx";
import OptionEffectsModal from "../../components/SectionAdmin/OptionEffectsModal.jsx";
import LxLoader from "../../components/LxLoader";
import { useToast } from "../../components/ui/ToastProvider";

import { fetchQuestionnaireActiveOverview, setQuestionActive } from "../../redux/action/index";

/**
 * Pagina ADMIN – Gestione DOMANDE ATTIVE del questionario.
 *
 * Nota per me futuro:
 * - Qui gestisco:
 *   - quali domande esistono
 *   - quali sono attive/disattive
 *   - che opzioni hanno
 *   - quali effetti (Genre / Tag / Metadata) sono agganciati a ciascuna opzione.
 *
 * Backend usato:
 * - GET   /api/QuestionnaireAdmin/questions/active-overview
 * - PATCH /api/QuestionnaireAdmin/questions/{id}/active
 *
 * DTO lato API (semplificato):
 * {
 *   id,
 *   code,
 *   textIt,
 *   isMultipleChoice,
 *   isActive,
 *   options: [
 *     {
 *       id,
 *       questionId,
 *       textIt,
 *       baseWeight,
 *       responseCount,
 *       responsePercentage,
 *       totalDeltaGenres,
 *       totalDeltaTags,
 *       totalDeltaMetadata,
 *       genreEffects: [
 *         {
 *           effectId,
 *           effectType: 1,
 *           deltaWeight,
 *           genreId,
 *           genreName,
 *           ...
 *         },
 *         ...
 *       ],
 *       tagEffects: [...],
 *       metadataEffects: [...]
 *     },
 *     ...
 *   ]
 * }
 *
 * Grazie alla configurazione JSON camelCase, qui in JS i campi arrivano già
 * in camelCase (id, code, textIt, isMultipleChoice, isActive, options, ecc.).
 */

export default function AdminQuestionsPage() {
  const dispatch = useDispatch();
  const { addToast } = useToast(); // NB: NON si fa dispatch(addToast). addToast è già una funzione.

  // =========================
  // STATO DAL REDUX STORE
  // =========================

  /**
   * Nota per me:
   * - La slice questionnaireActive ha shape:
   *   {
   *     overview: { questions: [...] } | null,
   *     loading: boolean,
   *     error: string | null,
   *     togglingById: { [questionId]: boolean }
   *   }
   */
  const { overview, loading, error, togglingById = {} } = useSelector((state) => state.questionnaireActive || {});

  // Se l’overview è null o manca, uso array vuoto per non esplodere.
  const questions = overview?.questions || [];

  // =========================
  // STATO LOCALE COMPONENT
  // =========================

  // Set con gli id delle domande espanse (accordion)
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  // Set con le chiavi delle pill di effetti espanse (es: "12-genres", "12-tags")
  const [expandedEffects, setExpandedEffects] = useState(new Set());

  // Stato per il modal "Gestisci effetti opzione"
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // =========================
  // CARICAMENTO INIZIALE
  // =========================

  useEffect(() => {
    // Al mount: chiedo a Redux di caricare l’overview delle domande attive
    dispatch(fetchQuestionnaireActiveOverview());
  }, [dispatch]);

  // =========================
  // HANDLER – ESPANSIONE DOMANDE
  // =========================

  const toggleQuestionExpanded = (questionId) => {
    // Nota per me:
    // Non devo mutare direttamente il Set esistente, quindi ne faccio una copia.
    const next = new Set(expandedQuestions);
    if (next.has(questionId)) {
      next.delete(questionId);
    } else {
      next.add(questionId);
    }
    setExpandedQuestions(next);
  };

  // =========================
  // HANDLER – ESPANSIONE EFFETTI (pill)
  // =========================

  const toggleEffectDetail = (optionId, effectTypeKey) => {
    // Chiave univoca per tipo di effetto di una certa opzione
    // (es: "5-genres", "5-tags", "5-metadata")
    const key = `${optionId}-${effectTypeKey}`;
    const next = new Set(expandedEffects);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setExpandedEffects(next);
  };

  // =========================
  // HANDLER – TOGGLE ATTIVA / DISATTIVA DOMANDA
  // =========================

  const handleToggleActive = async (question) => {
    const questionId = question.id;
    const nextIsActive = !question.isActive;

    // Per evitare doppi click folli mentre sto già togglando,
    // posso controllare se è già in corso un toggle per questa domanda.
    if (togglingById[questionId]) {
      return;
    }

    try {
      // La thunk fa la PATCH e poi aggiorna lo stato (success/failure).
      await dispatch(setQuestionActive(questionId, nextIsActive));

      // Feedback ottimistico: se la thunk non fa throw, mostro il toast.
      addToast(`Domanda "${question.code}" ${nextIsActive ? "attivata" : "disattivata"}.`, "success");
    } catch (err) {
      // Nel codice attuale la thunk NON fa throw, ma nel dubbio gestisco comunque.
      addToast(err?.message || "Errore durante il cambio di stato della domanda. Riprova.", "error");
    }
  };

  // =========================
  // HANDLER – APERTURA / CHIUSURA MODAL EFFETTI
  // =========================

  const openOptionEffectsModal = (question, option) => {
    if (!option?.id) return;

    // Mi costruisco un oggetto opzione “arricchito” con info della domanda
    setSelectedOption({
      ...option,
      questionId: question.id,
      questionCode: question.code,
      questionTextIt: question.textIt,
    });
    setEffectsModalOpen(true);
  };

  const closeOptionEffectsModal = () => {
    setEffectsModalOpen(false);
    setSelectedOption(null);
  };

  // =========================
  // UI – LOADING / ERROR GLOBALI
  // =========================

  if (loading) {
    return (
      <div className="lx-loading-container">
        <LxLoader message="Caricamento domande attive..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lx-error-container">
        <i className="bi bi-exclamation-triangle lx-error-icon" />
        <h3 className="lx-error-title">Errore nel caricamento</h3>
        <p className="lx-error-message">{error || "Impossibile caricare le domande attive. Riprova più tardi."}</p>
      </div>
    );
  }

  // =========================
  // FUNZIONI DI SUPPORTO – EFFETTI
  // =========================

  /**
   * pillClass:
   * Stabilisce la classe (colore) della pill in base al valore del delta.
   * Stessa logica usata nelle altre pagine (Generi, Tag, Metadata).
   */
  const pillClass = (value) => {
    if (value > 50) return "lx-pill-positive";
    if (value < -50) return "lx-pill-negative";
    if (value > 0) return "lx-pill-positive-light";
    if (value < 0) return "lx-pill-negative-light";
    return "lx-pill-neutral";
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="lx-admin-page">
      <div className="row g-3">
        <div className="col-12">
          <div className="lx-chart-card">
            {/* HEADER CARD */}
            <div className="lx-chart-card-header">
              <div>
                <h3 className="lx-chart-card-title">
                  <i className="bi bi-question-circle me-2" />
                  Domande del questionario
                </h3>
                <span className="lx-chart-card-subtitle">
                  Gestisco quali domande sono attive e, per ogni opzione, vedo come sono collegati generi, tag e metadata (e ora posso anche modificare gli
                  effetti).
                </span>
              </div>
            </div>

            {/* BODY – LISTA DOMANDE */}
            <div className="lx-chart-card-body">
              <div className="lx-questions-accordion">
                {questions.map((question) => {
                  const questionId = question.id;
                  const isExpanded = expandedQuestions.has(questionId);

                  const options = Array.isArray(question.options) ? question.options : [];

                  return (
                    <div key={questionId} className="lx-question-item lx-question-admin">
                      {/* HEADER DOMANDA (cliccabile per espandere) */}
                      <div className="lx-question-header" onClick={() => toggleQuestionExpanded(questionId)}>
                        <div className="lx-question-info">
                          <span className="lx-question-code">{question.code}</span>
                          <span className="lx-question-text">{question.textIt}</span>
                        </div>

                        <div className="lx-question-stats">
                          {/* Badge "Multipla" se isMultipleChoice === true */}
                          {question.isMultipleChoice && <span className="lx-badge-soft me-2">Multipla</span>}

                          {/* Toggle Attiva / Disattivata */}
                          <label
                            className="lx-toggle-switch me-3"
                            onClick={(e) => e.stopPropagation()} // Evito che il click apra/chiuda il pannello
                          >
                            <input
                              type="checkbox"
                              checked={!!question.isActive}
                              onChange={() => handleToggleActive(question)}
                              disabled={!!togglingById[questionId]}
                            />
                            <span className="lx-toggle-slider" />
                            <span className="lx-toggle-label ms-2">{question.isActive ? "Attiva" : "Disattivata"}</span>
                          </label>

                          <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"} ms-2`} />
                        </div>
                      </div>

                      {/* DETTAGLIO OPZIONI */}
                      {isExpanded && (
                        <div className="lx-question-options">
                          {options.map((option) => {
                            const optionId = option.id;

                            // 🔢 Totali per le pill, già pronti dal backend
                            const genreTotal = Number(option.totalDeltaGenres) || 0;
                            const tagTotal = Number(option.totalDeltaTags) || 0;
                            const metadataTotal = Number(option.totalDeltaMetadata) || 0;

                            // 🔍 Liste effetto per il dettaglio (uso i campi *Name* / *DisplayName* / *Value*)
                            const genreEffects = Array.isArray(option.genreEffects)
                              ? option.genreEffects.map((e) => ({
                                  id: e.effectId,
                                  name: e.genreName || `Genere #${e.genreId}`,
                                  code: null,
                                  delta: Number(e.deltaWeight) || 0,
                                }))
                              : [];

                            const tagEffects = Array.isArray(option.tagEffects)
                              ? option.tagEffects.map((e) => ({
                                  id: e.effectId,
                                  name: e.tagDisplayName || `Tag #${e.tagId}`,
                                  code: null,
                                  delta: Number(e.deltaWeight) || 0,
                                }))
                              : [];

                            const metadataEffects = Array.isArray(option.metadataEffects)
                              ? option.metadataEffects.map((e) => ({
                                  id: e.effectId,
                                  name: e.metadataValue || e.metadataCode, // es. "Story-driven"
                                  code: e.metadataCode, // es. "FOCUS:STORY"
                                  delta: Number(e.deltaWeight) || 0,
                                }))
                              : [];

                            const genresKey = `${optionId}-genres`;
                            const tagsKey = `${optionId}-tags`;
                            const metaKey = `${optionId}-metadata`;

                            const genresExpanded = expandedEffects.has(genresKey);
                            const tagsExpanded = expandedEffects.has(tagsKey);
                            const metaExpanded = expandedEffects.has(metaKey);

                            return (
                              <div key={optionId} className="lx-option-row lx-option-admin">
                                {/* Testo dell’opzione + baseWeight */}
                                <div className="lx-option-main">
                                  <div className="lx-option-text">{option.textIt}</div>
                                  <div className="lx-option-stats">
                                    <span className="lx-option-count">Peso base: {option.baseWeight}</span>

                                    {typeof option.responseCount === "number" && (
                                      <span className="lx-option-count ms-3">
                                        {option.responseCount} risposte ({option.responsePercentage?.toFixed?.(1) ?? "0.0"}
                                        %)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* PILL DEI DELTA (GENRE / TAG / METADATA) */}
                                <div className="lx-option-deltas">
                                  {/* Genres */}
                                  <button
                                    className={`lx-pill lx-pill-clickable ${pillClass(genreTotal)} ${genresExpanded ? "active" : ""}`}
                                    onClick={() => toggleEffectDetail(optionId, "genres")}
                                    title="Clicca per vedere il dettaglio dei generi"
                                  >
                                    <span className="lx-pill-label">Gen:</span>
                                    <span className="lx-pill-value">
                                      {genreTotal > 0 ? "+" : ""}
                                      {genreTotal}
                                    </span>
                                    <i className={`bi ${genresExpanded ? "bi-chevron-up" : "bi-chevron-down"} ms-1`} />
                                  </button>

                                  {/* Tags */}
                                  <button
                                    className={`lx-pill lx-pill-clickable ${pillClass(tagTotal)} ${tagsExpanded ? "active" : ""}`}
                                    onClick={() => toggleEffectDetail(optionId, "tags")}
                                    title="Clicca per vedere il dettaglio dei tag"
                                  >
                                    <span className="lx-pill-label">Tag:</span>
                                    <span className="lx-pill-value">
                                      {tagTotal > 0 ? "+" : ""}
                                      {tagTotal}
                                    </span>
                                    <i className={`bi ${tagsExpanded ? "bi-chevron-up" : "bi-chevron-down"} ms-1`} />
                                  </button>

                                  {/* Metadata */}
                                  <button
                                    className={`lx-pill lx-pill-clickable ${pillClass(metadataTotal)} ${metaExpanded ? "active" : ""}`}
                                    onClick={() => toggleEffectDetail(optionId, "metadata")}
                                    title="Clicca per vedere il dettaglio dei metadata"
                                  >
                                    <span className="lx-pill-label">Meta:</span>
                                    <span className="lx-pill-value">
                                      {metadataTotal > 0 ? "+" : ""}
                                      {metadataTotal}
                                    </span>
                                    <i className={`bi ${metaExpanded ? "bi-chevron-up" : "bi-chevron-down"} ms-1`} />
                                  </button>
                                </div>

                                {/* DETTAGLIO EFFETTI PER TIPO */}
                                {genresExpanded && <QuestionEffectsDetail type="genres" effects={genreEffects} />}

                                {tagsExpanded && <QuestionEffectsDetail type="tags" effects={tagEffects} />}

                                {metaExpanded && <QuestionEffectsDetail type="metadata" effects={metadataEffects} />}

                                {/* AZIONI OPZIONE: GESTISCI EFFETTI */}
                                <div className="d-flex justify-content-end mt-2">
                                  <button type="button" className="lx-btn lx-btn-outline lx-btn-sm" onClick={() => openOptionEffectsModal(question, option)}>
                                    <i className="bi bi-sliders me-1" />
                                    Gestisci effetti
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {questions.length === 0 && (
                  <div className="lx-empty-state mt-3">
                    <i className="bi bi-inbox lx-empty-icon" />
                    <p className="lx-empty-text">Nessuna domanda trovata nella configurazione del questionario.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: GESTIONE EFFETTI PER UNA OPZIONE */}
      <OptionEffectsModal
        isOpen={effectsModalOpen}
        onClose={closeOptionEffectsModal}
        option={selectedOption}
        // Ogni volta che creo/modifico/cancello un effetto,
        // ricarico l’overview per avere numeri aggiornati.
        onChanged={() => dispatch(fetchQuestionnaireActiveOverview())}
      />
    </div>
  );
}
