import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminImpactTable from "../../components/SectionAdmin/Adminimpacttable.jsx";
import MetadataFormModal from "../../components/SectionAdmin/MetadataFormModal";
import EntityUsageModal from "../../components/SectionAdmin/EntityUsageModal";
import ConfirmDeleteModal from "../../components/SectionAdmin/ConfirmDeleteModal";
import EntitySuggestionModal from "../../components/SectionAdmin/EntitySuggestionModal";

import {
  fetchAdminMetadata,
  deleteAdminMetadataFocus,
  deleteAdminMetadataMood,
  deleteAdminMetadataDifficulty,
  fetchEntityLinkSuggestions,
  createOptionEffect,
} from "../../redux/action/index.js";

import { apiFetch } from "../../apiFetch Autenticate/apiFetch.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";

// helper EntityLink (mapping string → enum numerico e costruzione request)
import { buildEntityLinkSuggestionRequest, ENTITY_LINK_ENTITY_TYPE } from "../../utils/entityLinkHelpers.js";

/**
 * Pagina admin per la gestione dei METADATA (Focus / Mood / Difficulty).
 *
 * Nota per me futuro:
 * - Legge dal reducer adminTaxonomy.metadata:
 *     state.adminTaxonomy.metadata = {
 *       focus: { items, loading, error },
 *       mood: { items, loading, error },
 *       difficulty: { items, loading, error },
 *       loading, // globale
 *       error,   // globale
 *     }
 * - items è una lista di MetadataAdminListItemDto in camelCase:
 *     {
 *       id,
 *       type,   // "FOCUS" | "MOOD" | "DIFFICULTY"
 *       code,
 *       name,
 *       description,
 *       keywordsIt,
 *       gamesCount,
 *       questionnaireEffectsCount,
 *       questionnaireTotalDelta,
 *       questionnaireOptionsCount,
 *       questionnaireQuestionsCount,
 *       sampleGames?: string[]
 *     }
 */
export default function AdminMetadataPage() {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("focus"); // 'focus' | 'mood' | 'difficulty'

  const [showFormModal, setShowFormModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const [selectedMetadata, setSelectedMetadata] = useState(null);

  const [usageData, setUsageData] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);

  const [deleteError, setDeleteError] = useState(null);

  // nuovo shape dello state: metadata = { focus, mood, difficulty, loading, error }
  const metadataState = useSelector((state) => state.adminTaxonomy.metadata || {});
  const { loading = false, error = null } = metadataState;
  const sliceForTab = metadataState[activeTab] || {};
  const metadataItems = Array.isArray(sliceForTab.items) ? sliceForTab.items : [];

  // Al mount: carico overview metadata
  useEffect(() => {
    dispatch(fetchAdminMetadata());
  }, [dispatch]);

  const tabToType = {
    focus: "FOCUS",
    mood: "MOOD",
    difficulty: "DIFFICULTY",
  };

  const typeToTabLabel = {
    focus: "Focus",
    mood: "Mood",
    difficulty: "Difficoltà",
  };

  const typeToIcon = {
    focus: "bi-bullseye",
    mood: "bi-emoji-smile",
    difficulty: "bi-speedometer2",
  };

  const tabConfig = {
    focus: {
      label: "Focus",
      icon: typeToIcon.focus,
      title: "Game Focus",
      subtitle: "Gestisci i focus di gioco (story-driven, gameplay-focused, ecc.)",
    },
    mood: {
      label: "Mood",
      icon: typeToIcon.mood,
      title: "Game Mood",
      subtitle: "Gestisci i mood di gioco (cozy, epico, intenso, ecc.)",
    },
    difficulty: {
      label: "Difficoltà",
      icon: typeToIcon.difficulty,
      title: "Game Difficulty",
      subtitle: "Gestisci i livelli di difficoltà dei giochi.",
    },
  };

  // Lista filtrata per tab attivo
  const currentData = useMemo(() => {
    const type = tabToType[activeTab];
    return metadataItems.filter((m) => m.type === type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataItems, activeTab]);

  // Delta massimo (in valore assoluto) per calcolo dell’impatto
  const maxAbsDelta = currentData.length ? Math.max(...currentData.map((m) => Math.abs(m.questionnaireTotalDelta || 0))) : 0;

  const rows = currentData.map((m) => {
    const totalDelta = m.questionnaireTotalDelta || 0;
    const impactPercent = maxAbsDelta > 0 ? (Math.abs(totalDelta) / maxAbsDelta) * 100 : 0;
    return {
      ...m,
      gamesInfo: {
        count: m.gamesCount || 0,
        examples: m.sampleGames || [],
      },
      rulesCount: m.questionnaireEffectsCount || 0,
      totalDelta,
      impactPercent,
    };
  });

  // =========================
  // HANDLER TABELLA
  // =========================

  const handleEdit = (metadataRow) => {
    setSelectedMetadata(metadataRow);
    setShowFormModal(true);
  };

  const handleNew = () => {
    setSelectedMetadata(null);
    setShowFormModal(true);
  };

  const handleDelete = (metadataRow) => {
    setSelectedMetadata(metadataRow);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedMetadata) return;

    try {
      const id = selectedMetadata.id;
      switch (activeTab) {
        case "focus":
          await dispatch(deleteAdminMetadataFocus(id));
          break;
        case "mood":
          await dispatch(deleteAdminMetadataMood(id));
          break;
        case "difficulty":
          await dispatch(deleteAdminMetadataDifficulty(id));
          break;
        default:
          break;
      }

      setShowDeleteModal(false);
      setSelectedMetadata(null);
      setDeleteError(null);
      addToast(`Metadata "${selectedMetadata.name}" eliminato.`, "success");
    } catch (err) {
      const msg = err?.message || "Errore durante l'eliminazione del metadata. Controlla collegamenti a giochi / questionario.";
      setDeleteError(msg);
      addToast(msg, "error");
    }
  };

  const handleViewUsage = async (metadataRow) => {
    setSelectedMetadata(metadataRow);
    setUsageLoading(true);
    setUsageError(null);

    try {
      const routeSegment = activeTab; // "focus" | "mood" | "difficulty"
      const res = await apiFetch(`/api/AdminTaxonomy/metadata/${routeSegment}/${metadataRow.id}/questionnaire-usage`, {
        method: "GET",
      });

      if (!res.ok) {
        let message = "Errore nel caricamento degli utilizzi nel questionario per questo metadata.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // tengo il messaggio di default
        }
        setUsageData([]);
        setUsageError(message);
        setShowUsageModal(true);
        return;
      }

      const data = await res.json();
      setUsageData(Array.isArray(data) ? data : []);
      setShowUsageModal(true);
    } catch (err) {
      setUsageData([]);
      setUsageError(err?.message || "Errore imprevisto nel caricamento degli utilizzi.");
      setShowUsageModal(true);
    } finally {
      setUsageLoading(false);
    }
  };

  // =========================
  // SUGGERIMENTI COLLEGAMENTI
  // =========================

  const handleSuggestLinks = async (metadataRow) => {
    if (!metadataRow) return;

    setSelectedMetadata(metadataRow);

    // es. "FOCUS:STORY", "MOOD:COZY"
    const metadataCode = `${metadataRow.type}:${metadataRow.code}`;

    try {
      const request = buildEntityLinkSuggestionRequest({
        entityType: "Metadata",
        entityKey: metadataCode,
        defaultDelta: 5,
        focusQuestionId: null,
        maxSuggestions: 50,
      });

      await dispatch(fetchEntityLinkSuggestions(request));
      setShowSuggestionsModal(true);
    } catch (err) {
      console.error("Errore nel fetch dei suggerimenti metadata:", err);
      addToast(err?.message || "Errore nel calcolo dei suggerimenti per questo metadata.", "error");
    }
  };

  const handleApplySuggestions = async (payload) => {
    const links = payload?.links || [];
    if (!links.length) return;

    // supporto sia stringa ("Metadata") che enum numerico (3)
    const isMetadataType = payload.entityType === "Metadata" || payload.entityType === ENTITY_LINK_ENTITY_TYPE.Metadata || payload.entityType === 3;

    if (!isMetadataType) {
      addToast("I suggerimenti ricevuti non sono di tipo Metadata.", "error");
      return;
    }

    // Provo a leggere dal payload, altrimenti ricostruisco dal metadata selezionato
    const payloadMetadataCode = payload.metadataCode;
    const fallbackMetadataCode =
      selectedMetadata && selectedMetadata.type && selectedMetadata.code ? `${selectedMetadata.type}:${selectedMetadata.code}` : null;

    const metadataCode = payloadMetadataCode || fallbackMetadataCode;

    if (!metadataCode) {
      addToast("MetadataCode mancante nei suggerimenti.", "error");
      return;
    }

    try {
      for (const link of links) {
        const effectPayload = {
          optionId: link.optionId,
          effectType: ENTITY_LINK_ENTITY_TYPE.Metadata, // 3 = Metadata
          genreId: null,
          tagId: null,
          metadataCode,
          deltaWeight: link.deltaWeight,
        };

        await dispatch(createOptionEffect(link.optionId, effectPayload));
      }

      addToast(`Aggiunti ${links.length} collegamenti per ${selectedMetadata?.name || "il metadata"}.`, "success");

      setShowSuggestionsModal(false);
      dispatch(fetchAdminMetadata());
    } catch (err) {
      console.error("Errore nell'applicazione dei suggerimenti metadata:", err);
      addToast(err?.message || "Errore nell'applicazione dei suggerimenti.", "error");
    }
  };

  const handleSaveFromModal = () => {
    setShowFormModal(false);
    setSelectedMetadata(null);
  };

  // =========================
  // UI: loading / error globali
  // =========================

  if (loading) {
    return (
      <div className="lx-loading-container">
        <div className="lx-spinner" />
        <p className="lx-loading-text">Caricamento metadata...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lx-error-container">
        <i className="bi bi-exclamation-triangle lx-error-icon" />
        <h3 className="lx-error-title">Errore nel caricamento</h3>
        <p className="lx-error-message">{error || "Impossibile caricare i metadata. Riprova più tardi."}</p>
      </div>
    );
  }

  // =========================
  // COLONNE TABELLA
  // =========================

  const columns = [
    {
      key: "name",
      label: "Nome",
      width: "2fr",
    },
    {
      key: "code",
      label: "Codice",
      width: "1.5fr",
    },
    {
      key: "gamesInfo",
      label: "Giochi",
      align: "center",
      width: "1fr",
      type: "count-with-tooltip",
    },
    {
      key: "rulesCount",
      label: "Regole",
      align: "center",
      width: "0.8fr",
      type: "badge",
    },
    {
      key: "totalDelta",
      label: "Delta totale",
      align: "center",
      width: "1fr",
      type: "delta",
    },
    {
      key: "impactPercent",
      label: "Impatto nel questionario",
      width: "1.5fr",
      type: "percent-bar",
    },
  ];

  // =========================
  // RENDER
  // =========================

  return (
    <div className="lx-admin-page">
      {/* Tabs Navigation */}
      <div className="lx-tabs-wrapper mb-4">
        <ul className="lx-nav-tabs">
          {Object.entries(tabConfig).map(([key, config]) => (
            <li key={key} className="lx-nav-tab-item">
              <button
                className={`lx-nav-tab-link ${activeTab === key ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(key);
                  setSelectedMetadata(null);
                  setUsageData([]);
                  setUsageError(null);
                  setDeleteError(null);
                }}
              >
                <i className={`bi ${config.icon} me-2`} />
                {config.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="row g-3">
        <div className="col-12">
          <AdminImpactTable
            title={tabConfig[activeTab].title}
            subtitle={tabConfig[activeTab].subtitle}
            columns={columns}
            rows={rows}
            percentField="impactPercent"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewUsage={handleViewUsage}
            onSuggestLinks={handleSuggestLinks}
            headerAction={
              <button className="lx-btn lx-btn-primary lx-btn-sm" onClick={handleNew}>
                <i className="bi bi-plus-lg me-2" />
                Nuovo {typeToTabLabel[activeTab]}
              </button>
            }
            emptyMessage={`Nessun ${typeToTabLabel[activeTab].toLowerCase()} trovato.`}
          />
        </div>
      </div>

      {/* ===== MODAL: CREA / MODIFICA METADATA ===== */}
      <MetadataFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedMetadata(null);
        }}
        metadata={selectedMetadata}
        metadataType={activeTab}
        onSave={handleSaveFromModal}
        onSuccess={(msg) => addToast(msg)}
        onError={(msg) => addToast(msg)}
      />

      {/* ===== MODAL: UTILIZZI NEL QUESTIONARIO ===== */}
      <EntityUsageModal
        isOpen={showUsageModal}
        onClose={() => {
          setShowUsageModal(false);
          setUsageData([]);
          setUsageError(null);
        }}
        entityName={selectedMetadata?.name}
        entityType={tabConfig[activeTab].label.toLowerCase()}
        usages={usageData}
        loading={usageLoading}
        error={usageError}
      />

      {/* ===== MODAL: CONFERMA ELIMINAZIONE ===== */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMetadata(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
        entityName={selectedMetadata?.name}
        entityType={tabConfig[activeTab].label.toLowerCase()}
        warningMessage={
          deleteError ||
          `Attenzione: non puoi eliminare questo ${tabConfig[activeTab].label.toLowerCase()} se è ancora associato a giochi o usato nel questionario.`
        }
      />

      {/* ===== MODAL: SUGGERIMENTI COLLEGAMENTI ===== */}
      <EntitySuggestionModal
        isOpen={showSuggestionsModal}
        onClose={() => {
          setShowSuggestionsModal(false);
        }}
        onApplySuggestions={handleApplySuggestions}
      />
    </div>
  );
}
