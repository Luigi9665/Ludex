import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import KpiCardsRow from "../../components/AnalyticsComponents/KpiCardsRow";
import GenresImpactCard from "../../components/AnalyticsComponents/GenresImpactCard";
import TagsImpactCard from "../../components/AnalyticsComponents/TagsImpactCard";
import MetadataImpactCard from "../../components/AnalyticsComponents/MetadataImpactCard";
import QuestionsUsageSection from "../../components/AnalyticsComponents/Questionsusagesection";

import { fetchQuestionnaireAnalyticsOverview } from "../../redux/action/index";

// CSS globale per la dashboard analytics
import "../../styles/Analytics/Analytics.css";

/**
 * Nota per me futuro:
 * - Pagina principale dashboard analytics questionario.
 * - Qui:
 *   - protezione Admin
 *   - chiamata Redux → API
 *   - mapping camelCase → PascalCase per i componenti UI
 */
export default function AnalyticsOverviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, overview, error } = useSelector((state) => state.questionnaireAnalytics);

  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "Admin";

  // Redirect se non sei admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  // Al mount carico le analytics
  useEffect(() => {
    dispatch(fetchQuestionnaireAnalyticsOverview());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="lx-loading-container">
        <div className="lx-spinner" />
        <p className="lx-loading-text">Caricamento dati analitici...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lx-error-container">
        <i className="bi bi-exclamation-triangle lx-error-icon" />
        <h3 className="lx-error-title">Errore nel caricamento</h3>
        <p className="lx-error-message">{error || "Impossibile caricare i dati analitici. Riprova più tardi."}</p>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  // =========================
  // 1) Normalizzazione chiavi (camelCase ↔ PascalCase)
  // =========================

  const rawGenres = overview.Genres ?? overview.genres ?? [];
  const rawTags = overview.Tags ?? overview.tags ?? [];
  const rawMetadata = overview.Metadata ?? overview.metadata ?? [];
  const rawQuestions = overview.QuestionsUsage ?? overview.questionsUsage ?? [];

  // Genres / Tags: mappo al tuo PreferenceAggregateDto con PascalCase
  const genres = rawGenres.map((g) => ({
    Id: g.Id ?? g.id,
    Name: g.Name ?? g.name,
    Code: g.Code ?? g.code,
    EffectsCount: g.EffectsCount ?? g.effectsCount,
    TotalDelta: g.TotalDelta ?? g.totalDelta,
    MinDelta: g.MinDelta ?? g.minDelta,
    MaxDelta: g.MaxDelta ?? g.maxDelta,
    AvgDelta: g.AvgDelta ?? g.avgDelta,
    OptionsCount: g.OptionsCount ?? g.optionsCount,
    QuestionsCount: g.QuestionsCount ?? g.questionsCount,
    WeightSharePercent: g.WeightSharePercent ?? g.weightSharePercent ?? 0,
  }));

  const tags = rawTags.map((t) => ({
    Id: t.Id ?? t.id,
    Name: t.Name ?? t.name,
    Code: t.Code ?? t.code,
    EffectsCount: t.EffectsCount ?? t.effectsCount,
    TotalDelta: t.TotalDelta ?? t.totalDelta,
    MinDelta: t.MinDelta ?? t.minDelta,
    MaxDelta: t.MaxDelta ?? t.maxDelta,
    AvgDelta: t.AvgDelta ?? t.avgDelta,
    OptionsCount: t.OptionsCount ?? t.optionsCount,
    QuestionsCount: t.QuestionsCount ?? t.questionsCount,
    WeightSharePercent: t.WeightSharePercent ?? t.weightSharePercent ?? 0,
  }));

  const metadata = rawMetadata.map((m) => ({
    Code: m.Code ?? m.code,
    Type: m.Type ?? m.type,
    Value: m.Value ?? m.value,
    EffectsCount: m.EffectsCount ?? m.effectsCount,
    TotalDelta: m.TotalDelta ?? m.totalDelta,
    MinDelta: m.MinDelta ?? m.minDelta,
    MaxDelta: m.MaxDelta ?? m.maxDelta,
    AvgDelta: m.AvgDelta ?? m.avgDelta,
    OptionsCount: m.OptionsCount ?? m.optionsCount,
    QuestionsCount: m.QuestionsCount ?? m.questionsCount,
    WeightSharePercent: m.WeightSharePercent ?? m.weightSharePercent ?? 0,
  }));

  const questions = rawQuestions.map((q) => ({
    QuestionId: q.QuestionId ?? q.questionId,
    Code: q.Code ?? q.code,
    TextIt: q.TextIt ?? q.textIt,
    IsMultipleChoice: q.IsMultipleChoice ?? q.isMultipleChoice,
    TotalResponses: q.TotalResponses ?? q.totalResponses ?? 0,
    Options: (q.Options ?? q.options ?? []).map((o) => ({
      OptionId: o.OptionId ?? o.optionId,
      TextIt: o.TextIt ?? o.textIt,
      ResponseCount: o.ResponseCount ?? o.responseCount ?? 0,
      ResponsePercentage: o.ResponsePercentage ?? o.responsePercentage ?? 0,
      TotalDeltaGenres: o.TotalDeltaGenres ?? o.totalDeltaGenres ?? 0,
      TotalDeltaTags: o.TotalDeltaTags ?? o.totalDeltaTags ?? 0,
      TotalDeltaMetadata: o.TotalDeltaMetadata ?? o.totalDeltaMetadata ?? 0,
    })),
  }));

  // =========================
  // 2) Statistiche per le KPI card
  // =========================
  const stats = {
    genres: {
      used: overview.genres?.length ?? 0,
      total: overview.totalGenresCount ?? overview.genres?.length ?? 0,
    },
    tags: {
      used: overview.tags?.length ?? 0,
      total: overview.totalTagsCount ?? overview.tags?.length ?? 0,
    },
    metadata: {
      used: overview.metadata?.length ?? 0,
      total: overview.totalMetadataCount ?? overview.metadata?.length ?? 0,
    },
    questions: {
      used: overview.questionsUsage?.length ?? 0,
      // per ora totale = usate (tutte le domande del questionario sono in QuestionsUsage)
      total: overview.questionsUsage?.length ?? 0,
    },
  };

  // calcolo percentuali una volta sola
  const computeCoverage = ({ used, total }) => (total > 0 ? Math.round((used / total) * 100) : 0);

  stats.genres.coverage = computeCoverage(stats.genres);
  stats.tags.coverage = computeCoverage(stats.tags);
  stats.metadata.coverage = computeCoverage(stats.metadata);
  stats.questions.coverage = computeCoverage(stats.questions);

  // =========================
  // 3) Render UI
  // =========================
  return (
    <div className="lx-analytics-page">
      {/* KPI Cards Row */}
      <KpiCardsRow stats={stats} />

      {/* Impact Charts - 3 colonne su desktop */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <GenresImpactCard genres={genres} />
        </div>
        <div className="col-12 col-lg-4">
          <TagsImpactCard tags={tags} />
        </div>
        <div className="col-12 col-lg-4">
          <MetadataImpactCard metadata={metadata} />
        </div>
      </div>

      {/* Questions Usage Section */}
      <QuestionsUsageSection questions={questions} />
    </div>
  );
}
