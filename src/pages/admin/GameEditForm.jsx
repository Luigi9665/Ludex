import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../apiFetch Autenticate/apiFetch";
import { safeJson } from "../../apiFetch Autenticate/safeJson";

import AdminGameFormStepper from "./AdminGameFormStepper";
import GameBaseFields from "./GameBaseFields";
import GamePlatformGenreSelector from "./GamePlatformGenreSelector";
import GameMetadataBasic from "./GameMetadataBasic";
import GameTagSelector from "./GameTagSelector";
import GamePreviewCard from "./GamePreviewCard";
import GameFormButtons from "./GameFormButtons";
import GameFormMessages from "./GameFormMessages";

/**
 * Form edit gioco (multi-step)
 *
 * Props:
 * - game: DTO da /api/Games/admin/{id}
 *   {
 *     gameId, title, description, releaseDate, coverUrl,
 *     platformIds: number[], genreIds: number[],
 *     primaryFocusId, primaryMoodId, difficultyId,
 *     averageLengthHours, isMultiplayer, isCoop, freeGame, isDeleted,
 *     tagIds: number[]
 *   }
 * - genres, platforms, focuses, moods, difficulties, tags: array metadata
 * - onSaved(): callback dopo salvataggio OK (la tua pagina fa navigate)
 */
const GameEditForm = ({ game, genres, platforms, focuses, moods, difficulties, tags, onSaved }) => {
  const navigate = useNavigate();

  const normalizedPlatforms = useMemo(
    () =>
      (platforms || []).map((p) => ({
        id: p.platformId ?? p.id,
        name: p.name,
      })),
    [platforms],
  );

  const normalizedGenres = useMemo(
    () =>
      (genres || []).map((g) => ({
        id: g.genreId ?? g.id,
        name: g.name,
      })),
    [genres],
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    coverUrl: "",
    platformIds: [],
    genreIds: [],
    primaryFocusId: null,
    primaryMoodId: null,
    difficultyId: null,
    averageLengthHours: null,
    isMultiplayer: false,
    isCoop: false,
    freeGame: false,
    isDeleted: false,
    tagIds: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSteps = 3;

  // Sync iniziale dal DTO game
  useEffect(() => {
    if (!game) return;

    setForm({
      title: game.title ?? "",
      description: game.description ?? "",
      releaseDate: game.releaseDate ? String(game.releaseDate).substring(0, 10) : "",
      coverUrl: game.coverUrl ?? "",
      platformIds: (game.platformIds || []).map((x) => Number(x)),
      genreIds: (game.genreIds || []).map((x) => Number(x)),
      primaryFocusId: game.primaryFocusId !== null && game.primaryFocusId !== undefined ? Number(game.primaryFocusId) : null,
      primaryMoodId: game.primaryMoodId !== null && game.primaryMoodId !== undefined ? Number(game.primaryMoodId) : null,
      difficultyId: game.difficultyId !== null && game.difficultyId !== undefined ? Number(game.difficultyId) : null,
      averageLengthHours: game.averageLengthHours !== null && game.averageLengthHours !== undefined ? Number(game.averageLengthHours) : null,
      isMultiplayer: !!game.isMultiplayer,
      isCoop: !!game.isCoop,
      freeGame: !!game.freeGame,
      isDeleted: !!game.isDeleted,
      tagIds: (game.tagIds || []).map((x) => Number(x)),
    });
  }, [game]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = "Il titolo è obbligatorio";
      if (!form.releaseDate) {
        newErrors.releaseDate = "La data di rilascio è obbligatoria";
      }
    }

    if (step === 2) {
      if (!form.platformIds.length) {
        newErrors.platformIds = "Seleziona almeno una piattaforma";
      }
      if (!form.genreIds.length) {
        newErrors.genreIds = "Seleziona almeno un genere";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      setErrors({});
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setErrorMessage("Completa tutti i campi obbligatori prima di proseguire.");
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    setCurrentStep((s) => s + 1);
    setErrors({});
    setErrorMessage("");
  };

  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleDismissMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSave = async () => {
    const ok1 = validateStep(1);
    const ok2 = validateStep(2);
    if (!ok1 || !ok2) {
      setErrorMessage("Ci sono errori nel form. Controlla gli step precedenti.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        releaseDate: form.releaseDate,
        coverUrl: form.coverUrl.trim(),
        platformIds: form.platformIds,
        genreIds: form.genreIds,
        primaryFocusId: form.primaryFocusId,
        primaryMoodId: form.primaryMoodId,
        difficultyId: form.difficultyId,
        averageLengthHours: form.averageLengthHours,
        isMultiplayer: form.isMultiplayer,
        isCoop: form.isCoop,
        freeGame: form.freeGame,
        isDeleted: form.isDeleted,
        tagIds: form.tagIds,
      };

      const res = await apiFetch(`/api/Games/${game.gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await safeJson(res);

      if (res.status === 404) {
        throw new Error("Gioco non trovato (404).");
      }

      if (!res.ok) {
        throw new Error(body?.message || "Errore nel salvataggio del gioco.");
      }

      setSuccessMessage("Gioco aggiornato con successo!");

      setTimeout(() => {
        if (onSaved) onSaved();
        else navigate("/admin/games");
      }, 1500);
    } catch (err) {
      setErrorMessage(err?.message || "Errore imprevisto durante l'aggiornamento del gioco.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Toast bar in basso a destra anche per EDIT */}
      <GameFormMessages successMessage={successMessage} errorMessage={errorMessage} onDismiss={handleDismissMessages} variant="toast" />

      <div className="mb-3">
        <AdminGameFormStepper currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
      </div>

      <div className="row gap-4">
        <div className="col-lg-8 mb-4">
          {currentStep === 1 && <GameBaseFields form={form} onChange={setForm} errors={errors} />}

          {currentStep === 2 && (
            <GamePlatformGenreSelector
              platforms={normalizedPlatforms}
              genres={normalizedGenres}
              selectedPlatformIds={form.platformIds}
              selectedGenreIds={form.genreIds}
              onPlatformsChange={(ids) => setForm((prev) => ({ ...prev, platformIds: ids }))}
              onGenresChange={(ids) => setForm((prev) => ({ ...prev, genreIds: ids }))}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <>
              <GameMetadataBasic focuses={focuses || []} moods={moods || []} difficulties={difficulties || []} form={form} onChange={setForm} />
              <div className="mt-3">
                <GameTagSelector tags={tags || []} selectedTagIds={form.tagIds} onChange={(ids) => setForm((prev) => ({ ...prev, tagIds: ids }))} />
              </div>
            </>
          )}

          <div className="mt-3">
            <GameFormButtons
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSave={handleSave}
              isSaving={saving}
            />
          </div>
        </div>

        <div className="col-lg-3">
          <GamePreviewCard
            form={form}
            platforms={normalizedPlatforms}
            genres={normalizedGenres}
            focuses={focuses || []}
            moods={moods || []}
            difficulties={difficulties || []}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
};

export default GameEditForm;
