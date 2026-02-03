import React, { useState } from "react";

/**
 * Nota per me futuro:
 * - Mostra, per ogni domanda del questionario:
 *   * quante risposte ha ricevuto la domanda
 *   * per ogni opzione:
 *       - quanti utenti l'hanno scelta
 *       - la % di scelta sulla domanda
 *       - quanto "spinge" generi / tag / metadata (somma dei delta).
 *
 * - questions: QuestionUsageDto[]
 *   {
 *     QuestionId,
 *     Code,
 *     TextIt,
 *     IsMultipleChoice,
 *     TotalResponses,
 *     Options: OptionUsageDto[]
 *   }
 *
 * - OptionUsageDto:
 *   {
 *     OptionId,
 *     TextIt,
 *     ResponseCount,
 *     ResponsePercentage,
 *     TotalDeltaGenres,
 *     TotalDeltaTags,
 *     TotalDeltaMetadata
 *   }
 */
export default function QuestionsUsageSection({ questions }) {
  const safeQuestions = Array.isArray(questions) ? questions : [];

  // Uso un Set di id per sapere quali domande sono espanse
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Helper per i pill dei delta (Gen / Tag / Meta)
  const renderDeltaPill = (label, rawValue) => {
    const value = Number(rawValue) || 0;

    let className = "lx-pill-neutral";
    if (value > 50) className = "lx-pill-positive";
    else if (value < -50) className = "lx-pill-negative";
    else if (value > 0) className = "lx-pill-positive-light";
    else if (value < 0) className = "lx-pill-negative-light";

    return (
      <span className={`lx-pill ${className}`}>
        {label}: {value > 0 ? "+" : ""}
        {value}
      </span>
    );
  };

  const hasData = safeQuestions.length > 0;

  return (
    <div className="lx-chart-card mt-4">
      <div className="lx-chart-card-header">
        <h3 className="lx-chart-card-title">
          <i className="bi bi-question-circle me-2" />
          Domande &amp; risposte
        </h3>
        <span className="lx-chart-card-subtitle">Per ogni domanda vedi quante volte è stata scelta ogni opzione.</span>
      </div>

      <div className="lx-chart-card-body">
        {hasData && (
          <p className="text-white-50 small mb-3">
            La barra blu mostra la <strong>% di scelta</strong> per opzione. I pill <strong>Gen/Tag/Meta</strong> indicano quanto quell&apos;opzione spinge i
            pesi su generi, tag e metadata (somma dei delta, positiva o negativa).
          </p>
        )}

        {!hasData && <p className="text-white-50 small mb-0">Nessuna risposta disponibile per il questionario al momento.</p>}

        {hasData && (
          <div className="lx-questions-accordion">
            {safeQuestions.map((question) => {
              const { QuestionId, Code, TextIt, IsMultipleChoice, TotalResponses, Options } = question;

              const isExpanded = expandedQuestions.has(QuestionId);
              const totalResp = Number(TotalResponses) || 0;
              const safeOptions = Array.isArray(Options) ? Options : [];

              return (
                <div key={QuestionId} className="lx-question-item">
                  {/* HEADER DOMANDA */}
                  <button type="button" className="lx-question-header" onClick={() => toggleQuestion(QuestionId)}>
                    <div className="lx-question-info">
                      <span className="lx-question-code">{Code}</span>
                      <span className="lx-question-text">{TextIt}</span>
                    </div>

                    <div className="lx-question-stats">
                      <span className="lx-response-count">
                        <i className="bi bi-people me-1" />
                        {totalResp.toLocaleString("it-IT")} risposte
                      </span>

                      {IsMultipleChoice && <span className="lx-badge-soft ms-2">Multipla</span>}

                      <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"} ms-2`} />
                    </div>
                  </button>

                  {/* DETTAGLIO OPZIONI */}
                  {isExpanded && (
                    <div className="lx-question-options">
                      {safeOptions.map((option) => {
                        const {
                          OptionId,
                          TextIt: optionText,
                          ResponseCount,
                          ResponsePercentage,
                          TotalDeltaGenres,
                          TotalDeltaTags,
                          TotalDeltaMetadata,
                        } = option;

                        const respCount = Number(ResponseCount) || 0;
                        const rawPerc = Number(ResponsePercentage) || 0;
                        const perc = Math.max(0, Math.min(100, rawPerc)); // clamp 0–100

                        return (
                          <div key={OptionId} className="lx-option-row">
                            <div className="lx-option-main">
                              <div className="lx-option-text">{optionText}</div>

                              <div className="lx-option-stats">
                                <span className="lx-option-count">{respCount.toLocaleString("it-IT")} utenti</span>

                                <div className="lx-option-bar-container">
                                  <div className="lx-bar-track lx-bar-track-small">
                                    <div className="lx-bar-fill lx-bar-fill-accent" style={{ width: `${perc}%` }} />
                                  </div>
                                  <span className="lx-bar-label-small">{perc.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="lx-option-deltas">
                              {renderDeltaPill("Gen", TotalDeltaGenres)}
                              {renderDeltaPill("Tag", TotalDeltaTags)}
                              {renderDeltaPill("Meta", TotalDeltaMetadata)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
