import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminImpactTable from "../../components/SectionAdmin/Adminimpacttable";
import GenreFormModal from "../../components/SectionAdmin/GenreFormModal";
import EntityUsageModal from "../../components/SectionAdmin/EntityUsageModal";
import ConfirmDeleteModal from "../../components/SectionAdmin/ConfirmDeleteModal";

import { fetchAdminGenres, deleteAdminGenre } from "../../redux/action/index";

import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import LxLoader from "../../components/LxLoader";
import { useToast } from "../../components/ui/ToastProvider";

/**
 * Pagina admin per la gestione dei GENERI.
 *
 * Nota per me futuro:
 * - Legge i dati dal reducer adminTaxonomy.genres:
 *     state.adminTaxonomy.genres = { items, loading, error }
 * - items è una lista di GenreAdminListItemDto serializzati in camelCase:
 *     {
 *       id,
 *       name,
 *       gamesCount,
 *       sampleGames: string[],
 *       questionnaireEffectsCount,
 *       questionnaireTotalDelta,
 *       questionnaireOptionsCount,
 *       questionnaireQuestionsCount
 *     }
 * - Usa:
 *     - AdminImpactTable per la tabella
 *     - GenreFormModal per creare/modificare
 *     - ConfirmDeleteModal per cancellare
 *     - EntityUsageModal per vedere dove il genere è usato nel questionario
 */
export default function AdminGenresPage() {
  const dispatch = useDispatch();

  // Stato locale per i vari modali
  const [showFormModal, setShowFormModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState(null);

  // Stato per modal "utilizzi nel questionario"
  const [usageData, setUsageData] = useState([]); // Array<EntityUsageDto>
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);

  // Stato per errori in delete
  const [deleteError, setDeleteError] = useState(null);

  // Stato dal Redux store
  const { items: genres = [], loading, error } = useSelector((state) => state.adminTaxonomy.genres);

  const { addToast } = useToast();

  // Al mount: carico i generi dal backend
  useEffect(() => {
    dispatch(fetchAdminGenres());
  }, [dispatch]);

  // =========================
  // HANDLER AZIONI TABELLA
  // =========================

  const handleEdit = (genreRow) => {
    // genreRow è già un elemento della lista Redux (camelCase)
    setSelectedGenre(genreRow);
    setShowFormModal(true);
  };

  const handleNewGenre = () => {
    setSelectedGenre(null);
    setShowFormModal(true);
  };

  const handleDelete = (genreRow) => {
    setSelectedGenre(genreRow);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedGenre) return;

    try {
      await dispatch(deleteAdminGenre(selectedGenre.id));
      setShowDeleteModal(false);
      setSelectedGenre(null);
      setDeleteError(null);

      // ✅ niente dispatch, solo addToast con stringa
      addToast(`Genere "${selectedGenre.name}" eliminato.`, "success");
    } catch (err) {
      const msg = err?.message || "Errore nell'eliminazione del genere.";
      setDeleteError(msg);
      addToast(msg, "error");
    }
  };

  const handleViewUsage = async (genreRow) => {
    if (!genreRow?.id) return;

    setSelectedGenre(genreRow);
    setUsageLoading(true);
    setUsageError(null);
    setUsageData([]);

    try {
      const res = await apiFetch(`/api/AdminTaxonomy/genres/${genreRow.id}/questionnaire-usage`, { method: "GET" });

      if (!res.ok) {
        let message = "Errore nel caricamento degli utilizzi nel questionario.";
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {
          // lascio il messaggio di default
        }
        setUsageError(message);
        setUsageData([]);
        setShowUsageModal(true);
        return;
      }

      const raw = await res.json();

      // 🔧 Normalizzazione robusta:
      // - Se il backend torna direttamente una lista: [ ... ]
      // - Se torna un oggetto tipo { items: [ ... ] }
      const list = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];

      // Normalizziamo i nomi dei campi a camelCase:
      const normalized = list.map((u) => ({
        questionId: u.questionId ?? u.QuestionId ?? null,
        questionCode: u.questionCode ?? u.QuestionCode ?? "",
        questionText: u.questionText ?? u.QuestionText ?? "",
        optionId: u.optionId ?? u.OptionId ?? null,
        optionText: u.optionText ?? u.OptionText ?? "",
        delta: typeof u.delta === "number" ? u.delta : typeof u.Delta === "number" ? u.Delta : 0,
      }));

      setUsageData(normalized);
      setShowUsageModal(true);
    } catch (err) {
      setUsageError(err?.message || "Errore imprevisto nel caricamento degli utilizzi.");
      setUsageData([]);
      setShowUsageModal(true);
    } finally {
      setUsageLoading(false);
    }
  };

  // Il form chiama le action (create/update) al suo interno;
  // qui ci limitiamo a chiudere il modal.
  const handleSaveFromModal = () => {
    setShowFormModal(false);
    setSelectedGenre(null);
  };

  // =========================
  // UI: stati di caricamento / errore MAIN PAGE
  // =========================

  if (loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Caricamento generi..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="lx-error-container">
        <i className="bi bi-exclamation-triangle lx-error-icon" />
        <h3 className="lx-error-title">Errore nel caricamento</h3>
        <p className="lx-error-message">{error || "Impossibile caricare i generi. Riprova più tardi."}</p>
      </div>
    );
  }

  // =========================
  // PREPARAZIONE COLONNE / RIGHE
  // =========================

  // Calcolo un "impatto %" relativo usando il delta massimo in valore assoluto
  const maxAbsDelta = genres.length ? Math.max(...genres.map((g) => Math.abs(g.questionnaireTotalDelta || 0))) : 0;

  const rows = genres.map((g) => {
    const totalDelta = g.questionnaireTotalDelta || 0;
    const impactPercent = maxAbsDelta > 0 ? (Math.abs(totalDelta) / maxAbsDelta) * 100 : 0;

    return {
      ...g,
      // Per la colonna "Giochi" usiamo count-with-tooltip:
      // AdminImpactTable si aspetta { count, examples }
      gamesInfo: {
        count: g.gamesCount || 0,
        examples: g.sampleGames || [],
      },
      rulesCount: g.questionnaireEffectsCount || 0,
      totalDelta,
      impactPercent,
    };
  });

  const columns = [
    {
      key: "name",
      label: "Nome genere",
      width: "2fr",
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
      <div className="row g-3">
        <div className="col-12">
          <AdminImpactTable
            title="Generi di gioco"
            subtitle="Vedi quanti giochi usano ogni genere e quanto è forte il suo impatto nel questionario."
            columns={columns}
            rows={rows}
            percentField="impactPercent"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewUsage={handleViewUsage}
            headerAction={
              <button className="lx-btn lx-btn-primary lx-btn-sm" onClick={handleNewGenre}>
                <i className="bi bi-plus-lg me-2" />
                Nuovo genere
              </button>
            }
            emptyMessage="Nessun genere trovato. Crea il primo genere."
          />
        </div>
      </div>

      {/* ===== MODAL: CREA / MODIFICA GENERE ===== */}
      <GenreFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedGenre(null);
        }}
        genre={selectedGenre}
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
        entityName={selectedGenre?.name}
        entityType="genere"
        usages={usageData}
        loading={usageLoading}
        error={usageError}
      />

      {/* ===== MODAL: CONFERMA ELIMINAZIONE ===== */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedGenre(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
        entityName={selectedGenre?.name}
        entityType="genere"
        warningMessage={
          deleteError ||
          "Attenzione: non puoi eliminare un genere se è ancora usato da giochi o dal questionario. " + "Prima rimuovi i collegamenti, poi riprova."
        }
      />
    </div>
  );
}
