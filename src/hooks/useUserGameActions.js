import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { loadQuickPatchUsergame } from "../redux/action/index.js";

// Risolve l'id
const resolveUserGameId = (target) => {
  if (!target) return null;
  if (typeof target === "string") return target;
  return target.userGameId ?? target.userGameID ?? target.usergameId ?? target.id ?? null;
};

// Costruisce SEMPRE il payload completo da spedire al backend
const buildUserGamePayload = (game, overrides = {}) => {
  if (!game) return null;

  const baseStatus = game.status;
  const baseRating = typeof game.rating === "number" ? game.rating : 0;
  const baseProgress = typeof game.progress === "number" ? game.progress : 0;
  const baseReview = typeof game.review === "string" ? game.review : "";
  const baseIsReviewPublic = typeof game.isReviewPublic === "boolean" ? game.isReviewPublic : false;

  const { status, rating, progress, review, isReviewPublic } = overrides;

  return {
    status: status ?? baseStatus,
    rating: typeof rating === "number" ? rating : baseRating,
    progress: typeof progress === "number" ? progress : baseProgress,
    review: review ?? baseReview,
    isReviewPublic: typeof isReviewPublic === "boolean" ? isReviewPublic : baseIsReviewPublic,
  };
};

// Validazione dominio inline (speculare a quella del modal)
const validateDomainInline = (game, overrides = {}) => {
  const payload = buildUserGamePayload(game, overrides);
  if (!payload) return "Dati del gioco mancanti.";

  const { status, progress, rating, review, isReviewPublic } = payload;

  const isBacklog = status === "Backlog";
  const isCompleted = status === "Completed";
  const hasPlayed = !isBacklog || progress > 0;
  const trimmedReview = (review ?? "").trim();
  const hasRatingValue = typeof rating === "number" && rating > 0;

  if (progress < 0 || progress > 100) {
    return "Il progresso deve essere compreso tra 0 e 100%.";
  }

  if (isBacklog && progress !== 0) {
    return "Se il gioco è in Backlog, il progresso deve essere 0%.";
  }

  if (isCompleted && progress !== 100) {
    return "Se il gioco è completato, il progresso deve essere 100%.";
  }

  if (hasRatingValue) {
    if (!hasPlayed) {
      return "Puoi dare un voto solo dopo aver iniziato a giocare.";
    }
    if (rating < 1 || rating > 5) {
      return "Il voto deve essere compreso tra 1 e 5.";
    }
  }

  if (isReviewPublic) {
    if (!hasPlayed) {
      return "Puoi pubblicare una recensione solo dopo aver giocato almeno un po'.";
    }
    if (!trimmedReview || trimmedReview.length < 20) {
      return "La recensione pubblica deve avere almeno 20 caratteri.";
    }
  }

  return null;
};

export const useUserGameActions = (options = {}) => {
  const { isMe = true } = options;
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const patchUserGame = useCallback(
    async (gameOrId, overrides, successMessage) => {
      const userGameId = resolveUserGameId(gameOrId);

      if (!userGameId) {
        console.warn("[patchUserGame] userGameId mancante", gameOrId);
        addToast("Impossibile aggiornare il gioco: ID mancante.", "error");
        return;
      }

      const game = typeof gameOrId === "string" ? null : gameOrId;

      if (!game) {
        console.warn("[patchUserGame] game mancante per costruire il payload completo.");
        addToast("Impossibile aggiornare il gioco: dati mancanti.", "error");
        return;
      }

      const payload = buildUserGamePayload(game, overrides);

      try {
        await dispatch(loadQuickPatchUsergame(userGameId, payload, isMe));
        if (successMessage) {
          addToast(successMessage, "success");
        }
      } catch (error) {
        console.error("[patchUserGame] errore", error);
        addToast(error?.message || "Errore durante l'aggiornamento del gioco.", "error");
        throw error;
      }
    },
    [dispatch, isMe, addToast],
  );

  const startFromBacklog = useCallback(
    async (game) => {
      const nextProgress = typeof game?.progress === "number" ? game.progress : 0;

      await patchUserGame(
        game,
        {
          status: "Playing",
          progress: nextProgress,
        },
        "Gioco spostato in 'In corso'.",
      );
    },
    [patchUserGame],
  );

  const resumeFromPaused = useCallback(
    async (game) => {
      await patchUserGame(
        game,
        {
          status: "Playing",
        },
        "Sessione ripresa.",
      );
    },
    [patchUserGame],
  );

  const replayFromCompleted = useCallback(
    async (game) => {
      await patchUserGame(
        game,
        {
          status: "Playing",
          progress: 0,
        },
        "Nuova run avviata.",
      );
    },
    [patchUserGame],
  );

  const updateSession = useCallback(
    async (game, overrides, successMessage = "Sessione aggiornata.") => {
      const domainError = validateDomainInline(game, overrides);
      if (domainError) {
        addToast(domainError, "error");
        throw new Error(domainError);
      }

      await patchUserGame(game, overrides, successMessage);
    },
    [patchUserGame, addToast],
  );

  return {
    patchUserGame,
    startFromBacklog,
    resumeFromPaused,
    replayFromCompleted,
    updateSession,
  };
};
