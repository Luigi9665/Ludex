// src/components/SectionAdmin/EntitySuggestionModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import LxLoader from "../LxLoader";
import { clearEntityLinkSuggestions } from "../../redux/action/index";

/**
 * Modal per visualizzare/applicare i suggerimenti AI di collegamento entità → opzioni.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onApplySuggestions?: (payload) => void
 *    payload: {
 *      entityType: "Genre" | "Tag" | "Metadata",
 *      entityId?: number | null,
 *      metadataCode?: string | null,
 *      links: { optionId: number, deltaWeight: number }[]
 *    }
 */
export default function EntitySuggestionModal({ isOpen, onClose, onApplySuggestions }) {
  const dispatch = useDispatch();

  // blocco scroll body
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Redux: questionnaireEffects.suggestions
  const suggestionsState = useSelector((state) => state.questionnaireEffects?.suggestions || {});
  const loading = suggestionsState.loading || false;
  const error = suggestionsState.error || null;
  const data = suggestionsState.data || null;

  // selections: { [optionId]: { selected: boolean, delta: number } }
  const [selections, setSelections] = useState({});

  // inizializzo quando arrivano i dati
  useEffect(() => {
    if (!data?.suggestions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelections({});
      return;
    }

    const initial = {};
    data.suggestions.forEach((s) => {
      initial[s.optionId] = {
        selected: false,
        delta: s.suggestedDelta ?? 5,
      };
    });

    setSelections(initial);
  }, [data]);

  // pulizia quando chiudo
  useEffect(() => {
    if (!isOpen) {
      dispatch(clearEntityLinkSuggestions());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelections({});
    }
  }, [isOpen, dispatch]);

  const selectedCount = useMemo(() => Object.values(selections).filter((s) => s.selected).length, [selections]);

  const allSelected = useMemo(() => {
    if (!data?.suggestions?.length) return false;
    if (!Object.keys(selections).length) return false;
    return Object.values(selections).every((s) => s.selected);
  }, [selections, data]);

  const handleToggleSelection = (optionId) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: {
        ...(prev[optionId] || { delta: 5 }),
        selected: !prev[optionId]?.selected,
      },
    }));
  };

  const handleToggleAll = () => {
    const newVal = !allSelected;
    setSelections((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((optionId) => {
        updated[optionId] = { ...updated[optionId], selected: newVal };
      });
      return updated;
    });
  };

  const handleDeltaChange = (optionId, newDelta) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        delta: newDelta,
      },
    }));
  };

  const handleApply = () => {
    if (!data || selectedCount === 0) return;

    const links = Object.entries(selections)
      .filter(([, sel]) => sel.selected)
      .map(([optionId, sel]) => ({
        optionId: Number(optionId),
        deltaWeight: sel.delta,
      }));

    const payload = {
      entityType: data.entityType,
      entityId: data.entityId ?? null,
      metadataCode: data.metadataCode ?? null,
      links,
    };

    onApplySuggestions?.(payload);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose} style={{ zIndex: 2050 }} />

      <div className="lx-modal-panel lx-modal-entity-suggestions" style={{ zIndex: 2051 }}>
        {/* HEADER */}
        <div className="lx-modal-header">
          <div>
            <h3 className="lx-modal-title">
              <i className="bi bi-magic me-2" />
              Suggerimenti collegamenti
            </h3>

            {data && (
              <div className="lx-modal-subtitle mt-1">
                <span className="text-white-50">Entità:</span>
                <span className="lx-pill lx-pill-soft ms-2">{data.entityType}</span>
                {data.entityDisplayName && <span className="text-white ms-2">{data.entityDisplayName}</span>}
              </div>
            )}
          </div>

          <button className="lx-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* BODY */}
        <div className="lx-modal-body lx-modal-body-scroll">
          {loading ? (
            <LxLoader message="Calcolo suggerimenti in corso..." />
          ) : error ? (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2" />
              {error}
            </div>
          ) : !data || !data.suggestions?.length ? (
            <div className="lx-empty-state py-5">
              <i className="bi bi-inbox lx-empty-icon" />
              <p className="lx-empty-text">
                Nessun suggerimento disponibile per questa entità.
                <br />
                <span className="text-white-50">Prova con un&apos;altra entità o controlla i dati storici.</span>
              </p>
            </div>
          ) : (
            <>
              {/* Intro */}
              <div className="lx-suggestions-intro">
                <p className="text-white-50 mb-0">
                  <i className="bi bi-info-circle me-2" />
                  In base alle risposte storiche degli utenti, questi collegamenti potrebbero avere senso. Seleziona le opzioni dove vuoi applicare questo
                  effetto e modifica i delta se necessario.
                </p>
              </div>

              <div className="lx-divider my-4" />

              {/* DESKTOP TABLE */}
              <div className="lx-suggestions-table d-none d-md-block">
                <div className="lx-suggestions-table-header">
                  <div className="lx-suggestions-col-select">
                    <input type="checkbox" className="form-check-input" checked={allSelected} onChange={handleToggleAll} title="Seleziona/Deseleziona tutto" />
                  </div>
                  <div className="lx-suggestions-col-question">Domanda</div>
                  <div className="lx-suggestions-col-option">Opzione</div>
                  <div className="lx-suggestions-col-delta">Delta</div>
                  <div className="lx-suggestions-col-score">Score</div>
                </div>

                {data.suggestions.map((s) => {
                  const sel = selections[s.optionId] || {
                    selected: false,
                    delta: s.suggestedDelta ?? 5,
                  };
                  const scorePercent = Math.round((s.score || 0) * 100);

                  return (
                    <div key={s.optionId} className={`lx-suggestions-table-row ${sel.selected ? "selected" : ""}`}>
                      <div className="lx-suggestions-col-select">
                        <input type="checkbox" className="form-check-input" checked={sel.selected} onChange={() => handleToggleSelection(s.optionId)} />
                      </div>

                      <div className="lx-suggestions-col-question">
                        <div className="lx-suggestion-question-code">{s.questionCode}</div>
                        <div className="lx-suggestion-question-text">{s.questionTextIt}</div>
                      </div>

                      <div className="lx-suggestions-col-option">
                        <span className="lx-suggestion-option-text">{s.optionTextIt}</span>
                      </div>

                      <div className="lx-suggestions-col-delta">
                        <input
                          type="number"
                          className="form-control form-control-sm lx-delta-input"
                          value={sel.delta}
                          onChange={(e) => handleDeltaChange(s.optionId, Number(e.target.value) || 0)}
                          disabled={!sel.selected}
                        />
                      </div>

                      <div className="lx-suggestions-col-score">
                        <span className={`lx-score-badge ${scorePercent >= 70 ? "high" : scorePercent >= 40 ? "medium" : "low"}`}>{scorePercent}%</span>
                      </div>

                      {s.reason && (
                        <div className="lx-suggestions-col-reason">
                          <small className="text-white-50">
                            <i className="bi bi-lightbulb me-1" />
                            {s.reason}
                          </small>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* MOBILE CARDS */}
              <div className="lx-suggestions-cards d-md-none">
                {data.suggestions.map((s) => {
                  const sel = selections[s.optionId] || {
                    selected: false,
                    delta: s.suggestedDelta ?? 5,
                  };
                  const scorePercent = Math.round((s.score || 0) * 100);

                  return (
                    <div key={s.optionId} className={`lx-suggestion-card ${sel.selected ? "selected" : ""}`}>
                      <div className="lx-suggestion-card-header">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <input type="checkbox" className="form-check-input" checked={sel.selected} onChange={() => handleToggleSelection(s.optionId)} />
                            <span className="lx-suggestion-question-code">{s.questionCode}</span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span className={`lx-score-badge ${scorePercent >= 70 ? "high" : scorePercent >= 40 ? "medium" : "low"}`}>{scorePercent}%</span>

                            <input
                              type="number"
                              className="form-control form-control-sm lx-delta-input-mobile"
                              value={sel.delta}
                              onChange={(e) => handleDeltaChange(s.optionId, Number(e.target.value) || 0)}
                              disabled={!sel.selected}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="lx-suggestion-card-body">
                        <div className="lx-suggestion-question-text mb-2">{s.questionTextIt}</div>

                        <div className="lx-suggestion-option-text">
                          <i className="bi bi-arrow-return-right me-2 text-white-50" />
                          {s.optionTextIt}
                        </div>
                      </div>

                      {s.reason && (
                        <div className="lx-suggestion-card-footer">
                          <small className="text-white-50">
                            <i className="bi bi-lightbulb me-1" />
                            {s.reason}
                          </small>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="lx-modal-footer">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="text-white-50">
              {selectedCount > 0 && (
                <>
                  <i className="bi bi-check-circle me-2" />
                  {selectedCount} {selectedCount === 1 ? "opzione selezionata" : "opzioni selezionate"}
                </>
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="lx-btn lx-btn-outline" onClick={onClose}>
                <i className="bi bi-x-lg me-2" />
                Chiudi
              </button>

              <button type="button" className="lx-btn lx-btn-primary" onClick={handleApply} disabled={selectedCount === 0 || loading}>
                <i className="bi bi-magic me-2" />
                Applica collegamenti ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
