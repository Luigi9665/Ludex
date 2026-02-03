import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminImpactTable from "../../components/SectionAdmin/Adminimpacttable.jsx";
import TagFormModal from "../../components/SectionAdmin/TagFormModal";
import EntityUsageModal from "../../components/SectionAdmin/EntityUsageModal";
import ConfirmDeleteModal from "../../components/SectionAdmin/ConfirmDeleteModal";

import { fetchAdminTags, deleteAdminTag } from "../../redux/action/index.js";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";

/**
 * Pagina admin per la gestione dei TAG.
 *
 * Nota per me futuro:
 * - Legge i dati dal reducer adminTaxonomy.tags:
 *     state.adminTaxonomy.tags = { items, loading, error }
 * - items è una lista di TagAdminListItemDto serializzati in camelCase:
 *     {
 *       id,
 *       code,
 *       displayName,
 *       category,
 *       description,
 *       isActive,
 *       displayOrder,
 *       gamesCount,
 *       questionnaireEffectsCount,
 *       questionnaireTotalDelta,
 *       questionnaireOptionsCount,
 *       questionnaireQuestionsCount,
 *       // opzionale: sampleGames: string[]
 *     }
 */
export default function AdminTagsPage() {
  const dispatch = useDispatch();

  // Stato locale per modali / usage
  const [showFormModal, setShowFormModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const [usageData, setUsageData] = useState([]); // Array<EntityUsageDto-like>
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);

  const [deleteError, setDeleteError] = useState(null);

  // Stato dal Redux store
  const { items: tags = [], loading, error } = useSelector((state) => state.adminTaxonomy.tags);

  const { addToast } = useToast();

  // Al mount: carico i tag dal backend
  useEffect(() => {
    dispatch(fetchAdminTags());
  }, [dispatch]);

  // =========================
  // HANDLER TABELLA
  // =========================

  const handleEdit = (tagRow) => {
    setSelectedTag(tagRow);
    setShowFormModal(true);
  };

  const handleNewTag = () => {
    setSelectedTag(null);
    setShowFormModal(true);
  };

  const handleDelete = (tagRow) => {
    setSelectedTag(tagRow);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTag) return;

    try {
      await dispatch(deleteAdminTag(selectedTag.id));
      setShowDeleteModal(false);
      setSelectedTag(null);
      setDeleteError(null);
      // Il reducer rimuove l’item; non serve refetch qui.

      // ✅ niente dispatch, solo addToast con stringa
      addToast(`Tag "${selectedTag.name}" eliminato.`, "success");
    } catch (err) {
      setDeleteError(err?.message || "Errore nell'eliminazione del tag.");
      addToast(err?.message, "error");
    }
  };

  const handleViewUsage = async (tagRow) => {
    setSelectedTag(tagRow);
    setUsageLoading(true);
    setUsageError(null);

    try {
      // Endpoint pensato lato backend:
      // GET /api/AdminTaxonomy/tags/{id}/questionnaire-usage
      const res = await apiFetch(`/api/AdminTaxonomy/tags/${tagRow.id}/questionnaire-usage`, { method: "GET" });

      if (!res.ok) {
        let message = "Errore nel caricamento degli utilizzi nel questionario.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // lascio il messaggio di default
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

  // Il form chiama le action create/update al suo interno
  const handleSaveFromModal = () => {
    setShowFormModal(false);
    setSelectedTag(null);
    // Le thunk di create/update aggiornano i dati nel reducer
  };

  // =========================
  // UI: loading / error globali
  // =========================

  if (loading) {
    return (
      <div className="lx-loading-container">
        <div className="lx-spinner" />
        <p className="lx-loading-text">Caricamento tag...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lx-error-container">
        <i className="bi bi-exclamation-triangle lx-error-icon" />
        <h3 className="lx-error-title">Errore nel caricamento</h3>
        <p className="lx-error-message">{error || "Impossibile caricare i tag. Riprova più tardi."}</p>
      </div>
    );
  }

  // =========================
  // PREPARAZIONE COLONNE / RIGHE
  // =========================

  const maxAbsDelta = tags.length ? Math.max(...tags.map((t) => Math.abs(t.questionnaireTotalDelta || 0))) : 0;

  const rows = tags.map((t) => {
    const totalDelta = t.questionnaireTotalDelta || 0;
    const impactPercent = maxAbsDelta > 0 ? (Math.abs(totalDelta) / maxAbsDelta) * 100 : 0;

    return {
      ...t,
      gamesInfo: {
        count: t.gamesCount || 0,
        // opzionale: sampleGames lato backend; se manca → array vuoto
        examples: t.sampleGames || [],
      },
      rulesCount: t.questionnaireEffectsCount || 0,
      totalDelta,
      impactPercent,
    };
  });

  const columns = [
    {
      key: "displayName",
      label: "Nome",
      width: "1.5fr",
    },
    {
      key: "code",
      label: "Codice",
      width: "1.2fr",
    },
    {
      key: "category",
      label: "Categoria",
      align: "center",
      width: "1fr",
      type: "pill-category",
    },
    {
      key: "isActive",
      label: "Stato",
      align: "center",
      width: "0.8fr",
      type: "pill-active",
    },
    {
      key: "gamesInfo",
      label: "Giochi",
      align: "center",
      width: "0.8fr",
      type: "count-with-tooltip",
    },
    {
      key: "rulesCount",
      label: "Regole",
      align: "center",
      width: "0.7fr",
      type: "badge",
    },
    {
      key: "totalDelta",
      label: "Delta totale",
      align: "center",
      width: "0.8fr",
      type: "delta",
    },
    {
      key: "impactPercent",
      label: "Impatto nel questionario",
      width: "1.3fr",
      type: "percent-bar",
    },
  ];

  // =========================
  // RENDER
  // =========================

  return (
    <div className="lx-admin-page">
      <div className="row g-3">
        <div className="col-12">
          <AdminImpactTable
            title="Tag di gioco"
            subtitle="Gestisci i tag e vedi dove vengono usati nei giochi e nel questionario."
            columns={columns}
            rows={rows}
            percentField="impactPercent"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewUsage={handleViewUsage}
            headerAction={
              <button className="lx-btn lx-btn-primary lx-btn-sm" onClick={handleNewTag}>
                <i className="bi bi-plus-lg me-2" />
                Nuovo tag
              </button>
            }
            emptyMessage="Nessun tag trovato. Crea il primo tag."
          />
        </div>
      </div>

      {/* ===== MODAL: CREA / MODIFICA TAG ===== */}
      <TagFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
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
        entityName={selectedTag?.displayName}
        entityType="tag"
        usages={usageData}
        loading={usageLoading}
        error={usageError}
      />

      {/* ===== MODAL: CONFERMA ELIMINAZIONE ===== */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTag(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
        entityName={selectedTag?.displayName}
        entityType="tag"
        warningMessage={
          deleteError ||
          "Attenzione: non puoi eliminare un tag se è ancora usato da giochi o dal questionario. " +
            "Puoi disattivarlo impostando IsActive = false, oppure rimuovere prima i collegamenti."
        }
      />
    </div>
  );
}
