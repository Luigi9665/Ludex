// src/components/SectionAdmin/OptionEffectsModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LxLoader from "../LxLoader";
import EntitySuggestionModal from "./EntitySuggestionModal";

import {
  // effetti
  fetchOptionEffects,
  createOptionEffect,
  updateOptionEffect,
  deleteOptionEffect,
  fetchEntityLinkSuggestions,
  clearEntityLinkSuggestions,
  // taxonomy admin (per popolare le select)
  fetchAdminGenres,
  fetchAdminTags,
  fetchAdminMetadata,
} from "../../redux/action/index";
import { useToast } from "../ui/ToastProvider";
import { buildEntityLinkSuggestionRequest } from "../../utils/entityLinkHelpers";

// 🔔 hook toast (adatta il path/nome se diverso nel tuo progetto)

// Mappa "Genre" | "Tag" | "Metadata" → enum del backend (PreferenceEffectType)
const mapEffectTypeToEnum = (effectTypeStr) => {
  switch (effectTypeStr) {
    case "Genre":
      return 1;
    case "Tag":
      return 2;
    case "Metadata":
      return 3;
    default:
      return 0;
  }
};

/* ---------------------- Subcomponents ---------------------- */

function OptionMetadata({ option }) {
  if (!option) return null;

  return (
    <div className="lx-option-metadata">
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="lx-pill lx-pill-soft">{option.questionCode || "N/A"}</span>
        <span className="text-white-50">·</span>
        <span className="text-white fw-medium">{option.questionTextIt || "Domanda"}</span>
      </div>
      <div className="lx-option-text-display">
        <i className="bi bi-arrow-return-right me-2 text-white-50" />
        <span className="text-white">{option.textIt}</span>
      </div>
    </div>
  );
}

function EffectForm({ formState, onFormChange, onSubmit, onCancel, genres, tags, metadataItems, saving, isEdit }) {
  const { effectType, genreId, tagId, metadataCode, deltaWeight } = formState;

  const getEntitySelectItems = () => {
    if (effectType === "Genre") return genres;
    if (effectType === "Tag") return tags;
    if (effectType === "Metadata") return metadataItems;
    return [];
  };

  const getEntityValue = () => {
    if (effectType === "Genre") return genreId;
    if (effectType === "Tag") return tagId;
    if (effectType === "Metadata") return metadataCode;
    return "";
  };

  const handleEntityChange = (value) => {
    if (effectType === "Genre") onFormChange("genreId", value);
    else if (effectType === "Tag") onFormChange("tagId", value);
    else if (effectType === "Metadata") onFormChange("metadataCode", value);
  };

  const getEntityLabel = (item) => {
    if (effectType === "Genre") return item.name || "N/A";
    if (effectType === "Tag") return `${item.displayName || item.code} (${item.code})`;
    if (effectType === "Metadata") return item.name ? `${item.name} (${item.code})` : item.code;
    return "N/A";
  };

  const getEntityValueOpt = (item) => {
    if (effectType === "Genre") return item.id;
    if (effectType === "Tag") return item.id;
    if (effectType === "Metadata") return item.code;
    return null;
  };

  return (
    <div className="lx-effect-form-card">
      <div className="lx-effect-form-header">
        <h4 className="lx-effect-form-title">
          <i className={`bi ${isEdit ? "bi-pencil" : "bi-plus-circle"} me-2`} />
          {isEdit ? "Modifica effetto" : "Nuovo effetto"}
        </h4>
      </div>

      <form onSubmit={onSubmit}>
        <div className="lx-effect-form-body">
          {/* Row 1: Tipo, Entità, Delta */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label form-label-sm text-white-50">
                Tipo <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                value={effectType}
                onChange={(e) => onFormChange("effectType", e.target.value)}
                disabled={isEdit || saving}
              >
                <option value="Genre">Genere</option>
                <option value="Tag">Tag</option>
                <option value="Metadata">Metadata</option>
              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label form-label-sm text-white-50">
                {effectType === "Genre" ? "Genere" : effectType === "Tag" ? "Tag" : "Metadata"} <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                value={getEntityValue()}
                onChange={(e) => handleEntityChange(e.target.value)}
                disabled={isEdit || saving}
              >
                <option value="">Seleziona...</option>
                {getEntitySelectItems().map((item) => {
                  const val = getEntityValueOpt(item);
                  if (val == null) return null;
                  return (
                    <option key={val} value={val}>
                      {getEntityLabel(item)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label form-label-sm text-white-50">
                Delta <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={deltaWeight}
                onChange={(e) => onFormChange("deltaWeight", e.target.value)}
                disabled={saving}
                placeholder="es. +5 o -3"
              />
            </div>
          </div>

          {/* Row 2: Actions */}
          <div className="d-flex justify-content-end gap-2">
            {isEdit && (
              <button type="button" className="lx-btn lx-btn-ghost lx-btn-sm" onClick={onCancel} disabled={saving}>
                <i className="bi bi-x-lg me-2" />
                Annulla
              </button>
            )}

            <button type="submit" className="lx-btn lx-btn-primary lx-btn-sm" disabled={saving || !getEntityValue() || !deltaWeight}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <i className={`bi ${isEdit ? "bi-check-lg" : "bi-plus-lg"} me-2`} />
                  {isEdit ? "Salva modifiche" : "Crea effetto"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function EffectsList({ effects, deletingById, onEdit, onDelete, onSuggest, genres, tags, metadataItems }) {
  const getEntityDisplayName = (effect) => {
    if (effect.effectType === "Genre") {
      const genre = genres.find((g) => g.id === effect.genreId);
      return genre ? genre.name : `Genere #${effect.genreId}`;
    }
    if (effect.effectType === "Tag") {
      const tag = tags.find((t) => t.id === effect.tagId);
      return tag ? `${tag.displayName || tag.code} (#${tag.id})` : `Tag #${effect.tagId}`;
    }
    if (effect.effectType === "Metadata") {
      const meta = metadataItems.find((m) => m.code === effect.metadataCode);
      return meta ? (meta.name ? `${meta.name} (${meta.code})` : meta.code) : effect.metadataCode || "Metadata sconosciuto";
    }
    return "N/A";
  };

  if (effects.length === 0) {
    return (
      <div className="lx-empty-state py-5">
        <i className="bi bi-inbox lx-empty-icon" />
        <p className="lx-empty-text">
          Nessun effetto definito per questa opzione.
          <br />
          <span className="text-white-50">Crea il primo effetto usando il form sopra.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="lx-effects-list">
      {/* Desktop table */}
      <div className="lx-effects-table d-none d-md-block">
        <div className="lx-effects-table-header">
          <div className="lx-effects-col-type">Tipo</div>
          <div className="lx-effects-col-entity">Entità</div>
          <div className="lx-effects-col-delta">Delta</div>
          <div className="lx-effects-col-actions">Azioni</div>
        </div>

        {effects.map((effect) => {
          const isDeleting = deletingById[effect.id] || false;

          return (
            <div key={effect.id} className="lx-effects-table-row">
              <div className="lx-effects-col-type">
                <span className={`lx-pill lx-pill-${effect.effectType === "Genre" ? "primary" : effect.effectType === "Tag" ? "secondary" : "tertiary"}`}>
                  {effect.effectType}
                </span>
              </div>

              <div className="lx-effects-col-entity">
                <span className="lx-entity-name">{getEntityDisplayName(effect)}</span>
              </div>

              <div className="lx-effects-col-delta">
                <span className={`lx-delta-value ${effect.deltaWeight >= 0 ? "positive" : "negative"}`}>
                  {effect.deltaWeight >= 0 ? "+" : ""}
                  {effect.deltaWeight}
                </span>
              </div>

              <div className="lx-effects-col-actions">
                <div className="d-flex gap-2 justify-content-end">
                  <button className="lx-btn-table-action" onClick={() => onSuggest(effect)} title="Suggerisci collegamenti simili" disabled={isDeleting}>
                    <i className="bi bi-magic" />
                  </button>

                  <button className="lx-btn-table-action" onClick={() => onEdit(effect)} title="Modifica" disabled={isDeleting}>
                    <i className="bi bi-pencil" />
                  </button>

                  <button className="lx-btn-table-action lx-btn-danger" onClick={() => onDelete(effect)} title="Elimina" disabled={isDeleting}>
                    {isDeleting ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="lx-effects-cards d-md-none">
        {effects.map((effect) => {
          const isDeleting = deletingById[effect.id] || false;

          return (
            <div key={effect.id} className="lx-effect-card">
              <div className="lx-effect-card-header">
                <div className="d-flex align-items-center gap-2">
                  <span className={`lx-pill lx-pill-${effect.effectType === "Genre" ? "primary" : effect.effectType === "Tag" ? "secondary" : "tertiary"}`}>
                    {effect.effectType}
                  </span>
                  <span className={`lx-delta-value ${effect.deltaWeight >= 0 ? "positive" : "negative"}`}>
                    {effect.deltaWeight >= 0 ? "+" : ""}
                    {effect.deltaWeight}
                  </span>
                </div>
              </div>

              <div className="lx-effect-card-body">
                <span className="lx-entity-name">{getEntityDisplayName(effect)}</span>
              </div>

              <div className="lx-effect-card-footer">
                <div className="d-flex gap-2 justify-content-end">
                  <button className="lx-btn-table-action" onClick={() => onSuggest(effect)} disabled={isDeleting}>
                    <i className="bi bi-magic" />
                  </button>
                  <button className="lx-btn-table-action" onClick={() => onEdit(effect)} disabled={isDeleting}>
                    <i className="bi bi-pencil" />
                  </button>
                  <button className="lx-btn-table-action lx-btn-danger" onClick={() => onDelete(effect)} disabled={isDeleting}>
                    {isDeleting ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------- Main component ---------------------- */

export default function OptionEffectsModal({ isOpen, onClose, option, onChanged }) {
  const dispatch = useDispatch();
  const { addToast } = useToast(); // 🔔

  const optionId = option?.id;

  // Blocca scroll body
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Redux selectors
  const effectsState = useSelector((state) => (optionId ? state.questionnaireEffects?.byOptionId?.[optionId] : null));
  const loading = effectsState?.loading || false;
  const error = effectsState?.error || null;
  const effects = Array.isArray(effectsState?.items) ? effectsState.items : [];
  const deletingById = effectsState?.deletingById || {};
  const saving = effectsState?.saving || false;

  const { genres: genresSlice, tags: tagsSlice, metadata: metadataSlice } = useSelector((state) => state.adminTaxonomy || {});
  const genres = Array.isArray(genresSlice?.items) ? genresSlice.items : [];
  const tags = Array.isArray(tagsSlice?.items) ? tagsSlice.items : [];
  const metadataItems = Array.isArray(metadataSlice?.items) ? metadataSlice.items : [];

  // Caricamento effetti
  useEffect(() => {
    if (isOpen && optionId) {
      dispatch(fetchOptionEffects(optionId));
    }
  }, [isOpen, optionId, dispatch]);

  // Caricamento taxonomy
  useEffect(() => {
    if (!isOpen) return;
    if (!genres.length) dispatch(fetchAdminGenres());
    if (!tags.length) dispatch(fetchAdminTags());
    if (!metadataItems.length) dispatch(fetchAdminMetadata());
  }, [isOpen, genres.length, tags.length, metadataItems.length, dispatch]);

  // Form state
  const [formState, setFormState] = useState({
    formMode: "create",
    effectId: null,
    effectType: "Genre",
    genreId: "",
    tagId: "",
    metadataCode: "",
    deltaWeight: "5",
  });

  // Suggestion modal state
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  const resetForm = () => {
    setFormState({
      formMode: "create",
      effectId: null,
      effectType: "Genre",
      genreId: "",
      tagId: "",
      metadataCode: "",
      deltaWeight: "5",
    });
  };

  // Reset form quando chiudo
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetForm();
      dispatch(clearEntityLinkSuggestions());
    }
  }, [isOpen, dispatch]);

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartCreate = () => {
    resetForm();
  };

  const handleStartEdit = (effect) => {
    setFormState({
      formMode: "edit",
      effectId: effect.id,
      effectType: effect.effectType,
      genreId: effect.genreId ? String(effect.genreId) : "",
      tagId: effect.tagId ? String(effect.tagId) : "",
      metadataCode: effect.metadataCode || "",
      deltaWeight: String(effect.deltaWeight ?? 0),
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!optionId) return;

    const { formMode, effectId, effectType, genreId, tagId, metadataCode, deltaWeight } = formState;

    try {
      if (formMode === "create") {
        const payload = {
          optionId,
          effectType: mapEffectTypeToEnum(effectType),
          genreId: effectType === "Genre" && genreId ? Number(genreId) : null,
          tagId: effectType === "Tag" && tagId ? Number(tagId) : null,
          metadataCode: effectType === "Metadata" && metadataCode?.trim() ? metadataCode : null,
          deltaWeight: Number(deltaWeight) || 0,
        };

        await dispatch(createOptionEffect(optionId, payload));
        addToast(`Effetto creato correttamente.`, "success");
      } else if (formMode === "edit" && effectId != null) {
        const original = effects.find((e) => e.id === effectId);
        if (!original) {
          addToast("Impossibile trovare l'effetto da modificare.", "error");
          return;
        }

        const payload = {
          effectType: mapEffectTypeToEnum(original.effectType),
          genreId: original.genreId ?? null,
          tagId: original.tagId ?? null,
          metadataCode: original.metadataCode ?? null,
          deltaWeight: Number(deltaWeight) || 0,
        };

        await dispatch(updateOptionEffect(optionId, effectId, payload));
        addToast(`Effetto aggiornato correttamente.`, "success");
      }

      onChanged?.();
      resetForm();
    } catch (err) {
      console.error("Errore nel salvataggio effetto:", err);
      addToast(err?.message || "Errore nel salvataggio dell'effetto.", "error");
    }
  };

  const handleDeleteEffect = async (effect) => {
    const ok = window.confirm(`Vuoi davvero rimuovere questo effetto (delta ${effect.deltaWeight}) dall'opzione "${option?.textIt}"?`);
    if (!ok) return;

    try {
      await dispatch(deleteOptionEffect(optionId, effect.id));
      addToast("Effetto eliminato correttamente.", "success");
      onChanged?.();
    } catch (err) {
      console.error("Errore nella cancellazione effetto:", err);
      addToast(err?.message || "Errore nella cancellazione dell'effetto.", "error");
    }
  };

  const handleAskSuggestionsForEffect = async (effect) => {
    if (!option) return;

    let entityKey = null;
    let entityTypeStr = effect.effectType;

    // EntityKey: "32" per Genre, "45" per Tag, "FOCUS:STORY" per Metadata
    if (effect.effectType === "Genre" && effect.genreId != null) {
      entityKey = String(effect.genreId);
    } else if (effect.effectType === "Tag" && effect.tagId != null) {
      entityKey = String(effect.tagId);
    } else if (effect.effectType === "Metadata" && effect.metadataCode) {
      entityKey = effect.metadataCode;
    }

    if (!entityKey) {
      addToast("Impossibile costruire la richiesta di suggerimenti per questa entità.", "error");
      return;
    }

    const request = buildEntityLinkSuggestionRequest({
      entityType: entityTypeStr,
      entityKey,
      defaultDelta: effect.deltaWeight ?? 5,
    });

    try {
      await dispatch(fetchEntityLinkSuggestions(request));
      setSuggestionModalOpen(true);
    } catch (err) {
      console.error("Errore nel fetch dei suggerimenti:", err);
      addToast(err?.message || "Errore nel caricamento dei suggerimenti.", "error");
    }
  };

  const handleApplySuggestions = async (payload) => {
    try {
      // payload.links: [{ optionId, deltaWeight }]
      for (const link of payload.links) {
        const effectPayload = {
          optionId: link.optionId,
          effectType: mapEffectTypeToEnum(payload.entityType),
          genreId: payload.entityType === "Genre" ? Number(payload.entityId) || null : null,
          tagId: payload.entityType === "Tag" ? Number(payload.entityId) || null : null,
          metadataCode: payload.entityType === "Metadata" ? payload.metadataCode : null,
          deltaWeight: link.deltaWeight,
        };

        await dispatch(createOptionEffect(link.optionId, effectPayload));
      }

      addToast("Suggerimenti applicati correttamente.", "success");
      onChanged?.();
      setSuggestionModalOpen(false);
    } catch (err) {
      console.error("Errore nell'applicazione dei suggerimenti:", err);
      addToast(err?.message || "Errore nell'applicazione dei suggerimenti.", "error");
    }
  };

  if (!isOpen || !optionId) return null;

  return (
    <>
      <div className="lx-modal-backdrop" onClick={onClose} />

      <div className="lx-modal-panel lx-modal-xl lx-modal-scrollable">
        {/* HEADER */}
        <div className="lx-modal-header">
          <div>
            <h3 className="lx-modal-title">
              <i className="bi bi-sliders me-2" />
              Effetti opzione
            </h3>
            {option && (
              <div className="lx-modal-subtitle mt-1">
                <span className="lx-pill lx-pill-soft me-2">{option.questionCode || "N/A"}</span>
                <span className="text-white-50">{option.questionTextIt}</span>
              </div>
            )}
          </div>

          <button className="lx-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* BODY */}
        <div className="lx-modal-body lx-modal-body-scroll">
          <OptionMetadata option={option} />

          <div className="lx-divider my-4" />

          <EffectForm
            formState={formState}
            onFormChange={handleFormChange}
            onSubmit={handleSubmitForm}
            onCancel={handleStartCreate}
            genres={genres}
            tags={tags}
            metadataItems={metadataItems}
            saving={saving}
            isEdit={formState.formMode === "edit"}
          />

          <div className="lx-divider my-4" />

          <div className="lx-effects-section">
            <div className="lx-section-header mb-3">
              <h4 className="lx-section-title">
                <i className="bi bi-list-ul me-2" />
                Effetti configurati
                <span className="lx-badge-soft ms-2">{effects.length}</span>
              </h4>
            </div>

            {loading && !effects.length ? (
              <LxLoader message="Caricamento effetti..." />
            ) : error ? (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2" />
                {error}
              </div>
            ) : (
              <EffectsList
                effects={effects}
                deletingById={deletingById}
                onEdit={handleStartEdit}
                onDelete={handleDeleteEffect}
                onSuggest={handleAskSuggestionsForEffect}
                genres={genres}
                tags={tags}
                metadataItems={metadataItems}
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="lx-modal-footer">
          <button type="button" className="lx-btn lx-btn-outline" onClick={onClose}>
            <i className="bi bi-x-lg me-2" />
            Chiudi
          </button>

          {formState.formMode === "edit" && (
            <button type="button" className="lx-btn lx-btn-ghost" onClick={handleStartCreate} disabled={saving}>
              <i className="bi bi-plus-lg me-2" />
              Nuovo effetto
            </button>
          )}
        </div>
      </div>

      {/* MODAL SUGGERIMENTI */}
      <EntitySuggestionModal isOpen={suggestionModalOpen} onClose={() => setSuggestionModalOpen(false)} onApplySuggestions={handleApplySuggestions} />
    </>
  );
}
