// src/pages/admin/GameCreateForm.jsx
import React, { useMemo, useState } from "react";
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
 * Form creazione gioco (multi-step)
 *
 * Props:
 * - genres: array dal backend (con genreId o id)
 * - platforms: array dal backend (con platformId o id)
 * - focuses, moods, difficulties, tags: array metadata
 */
const GameCreateForm = ({ genres, platforms, focuses, moods, difficulties, tags }) => {
  const navigate = useNavigate();

  // Normalizzo id/name per piattaforme & generi
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

  // Stato form
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

  // Stato UI
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSteps = 3;

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
    // Validazione globale step 1+2
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
        releaseDate: form.releaseDate, // yyyy-MM-dd
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

      const res = await apiFetch("/api/Games/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await safeJson(res);

      if (!res.ok) {
        throw new Error(body?.message || "Errore nella creazione del gioco.");
      }

      setSuccessMessage("Gioco creato con successo!");

      setTimeout(() => {
        navigate("/admin/games");
      }, 1500);
    } catch (err) {
      setErrorMessage(err?.message || "Errore imprevisto durante la creazione del gioco.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Toast bar in basso a destra per success/error */}
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

export default GameCreateForm;
