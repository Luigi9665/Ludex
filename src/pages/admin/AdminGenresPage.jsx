import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminImpactTable from "../../components/SectionAdmin/Adminimpacttable";
import GenreFormModal from "../../components/SectionAdmin/GenreFormModal";
import EntityUsageModal from "../../components/SectionAdmin/EntityUsageModal";
import ConfirmDeleteModal from "../../components/SectionAdmin/ConfirmDeleteModal";
import EntitySuggestionModal from "../../components/SectionAdmin/EntitySuggestionModal";

import { fetchAdminGenres, deleteAdminGenre, fetchEntityLinkSuggestions, createOptionEffect } from "../../redux/action/index";

import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import LxLoader from "../../components/LxLoader";
import { useToast } from "../../components/ui/ToastProvider";

// 🔹 QUI usiamo davvero gli helper che hai messo in src/utils
import { buildEntityLinkSuggestionRequest, ENTITY_LINK_ENTITY_TYPE } from "../../utils/entityLinkHelpers";

export default function AdminGenresPage() {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  // Modali
  const [showFormModal, setShowFormModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState(null);

  // Usage modal
  const [usageData, setUsageData] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);

  // Delete error
  const [deleteError, setDeleteError] = useState(null);

  // Redux state
  const { items: genres = [], loading, error } = useSelector((state) => state.adminTaxonomy.genres);

  // Load generi
  useEffect(() => {
    dispatch(fetchAdminGenres());
  }, [dispatch]);

  // ============ Handlers tabella ============

  const handleEdit = (genreRow) => {
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
          /* ignore */
        }
        setUsageError(message);
        setUsageData([]);
        setShowUsageModal(true);
        return;
      }

      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];

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

  // 🔮 NUOVO: chiedi suggerimenti partendo da un GENERE
  const handleSuggestLinks = async (genreRow) => {
    if (!genreRow?.id) return;

    setSelectedGenre(genreRow);

    let request;
    try {
      request = buildEntityLinkSuggestionRequest({
        entityType: "Genre", // string "high level"
        entityKey: String(genreRow.id), // "2", "5", ...
        defaultDelta: 5,
        focusQuestionId: null,
        maxSuggestions: 50,
      });
      // qui dentro buildEntityLinkSuggestionRequest converte in enum numerico
    } catch (err) {
      addToast(err.message, "error");
      return;
    }

    try {
      await dispatch(fetchEntityLinkSuggestions(request));
      setShowSuggestionsModal(true);
    } catch (err) {
      addToast(err?.message || "Errore nel calcolo dei suggerimenti.", "error");
    }
  };

  // Quando l'utente clicca "Applica collegamenti"
  const handleApplySuggestions = async (payload) => {
    if (!selectedGenre) return;
    const links = payload?.links || [];
    if (!links.length) return;

    try {
      for (const link of links) {
        const effectPayload = {
          optionId: link.optionId,
          // 👇 Qui stiamo usando il valore numerico che, lato backend,
          // corrisponde al PreferenceEffectType.Genre (1)
          effectType: ENTITY_LINK_ENTITY_TYPE.Genre,
          genreId: selectedGenre.id,
          tagId: null,
          metadataCode: null,
          deltaWeight: link.deltaWeight,
        };

        await dispatch(createOptionEffect(link.optionId, effectPayload));
      }

      addToast(`Aggiunti ${links.length} collegamenti per il genere "${selectedGenre.name}".`, "success");

      setShowSuggestionsModal(false);
      // Ricarico i generi per aggiornare stats (Regole, Delta totale, ecc.)
      dispatch(fetchAdminGenres());
    } catch (err) {
      addToast(err?.message || "Errore nell'applicazione dei suggerimenti.", "error");
    }
  };

  const handleSaveFromModal = () => {
    setShowFormModal(false);
    setSelectedGenre(null);
  };

  // ============ Stati loading / errore pagina ============

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

  // ============ Preparazione colonne / righe ============

  const maxAbsDelta = genres.length ? Math.max(...genres.map((g) => Math.abs(g.questionnaireTotalDelta || 0))) : 0;

  const rows = genres.map((g) => {
    const totalDelta = g.questionnaireTotalDelta || 0;
    const impactPercent = maxAbsDelta > 0 ? (Math.abs(totalDelta) / maxAbsDelta) * 100 : 0;

    return {
      ...g,
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

  // ============ Render ============

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
            onSuggestLinks={handleSuggestLinks} // 👈 nuovo hook per l’icona magic
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

      {/* MODAL: CREA / MODIFICA GENERE */}
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

      {/* MODAL: UTILIZZI NEL QUESTIONARIO */}
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

      {/* MODAL: CONFERMA ELIMINAZIONE */}
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
          deleteError || "Attenzione: non puoi eliminare un genere se è ancora usato da giochi o dal questionario. Prima rimuovi i collegamenti, poi riprova."
        }
      />

      {/* MODAL: SUGGERIMENTI COLLEGAMENTI */}
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
