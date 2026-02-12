import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import loginReducer from "../reducer/loginReducer";
import userReducer from "../reducer/userReducer";
import { persistReducer, persistStore } from "redux-persist";
import homePublicReducer from "../reducer/homePublicReducer";
import genresPlatformsReducer from "../reducer/genresPlatformsReducer";
import libraryReducer from "../reducer/libraryReducer";
import navSearchReducer from "../reducer/navSearchReducer";
import gameDetailReducer from "../reducer/gameDetailReducer";
import patchDeleteReducer from "../reducer/patchDeleteReducer.js";
import adminGamesReducer from "../reducer/adminGamesReducer.js";
import questionnaireReducer from "../reducer/questionnaireReducer.js";
import recommendationReducer from "../reducer/recommendationReducer.js";
import questionnaireAnalyticsReducer from "../reducer/questionnaireAnalyticsReducer.js";
import adminTaxonomyReducer from "../reducer/adminTaxonomyReducer.js";
import questionnaireActiveReducer from "../reducer/questionnaireActiveReducer.js";
import questionnaireEffectsReducer from "../reducer/questionnaireEffectsReducer.js";
import { questionnaireAdminReducer } from "../reducer/questionnaireAdminReducer.js";
import gameInteractionReducer from "../reducer/gameInteractionReducer.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: loginReducer,
  userData: userReducer,
  homePublic: homePublicReducer,
  selectGame: genresPlatformsReducer,
  libraryGames: libraryReducer,
  navSearch: navSearchReducer,
  gameDetail: gameDetailReducer,
  modifiedUsergame: patchDeleteReducer,
  adminGames: adminGamesReducer,
  questionnaire: questionnaireReducer,
  recommendations: recommendationReducer,
  questionnaireAnalytics: questionnaireAnalyticsReducer,
  adminTaxonomy: adminTaxonomyReducer,
  questionnaireAdmin: questionnaireAdminReducer,
  questionnaireActive: questionnaireActiveReducer,
  questionnaireEffects: questionnaireEffectsReducer,
  gameInteraction: gameInteractionReducer,
});

const persisterReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisterReducer,
  middleware: (getDefaltMiddleware) => getDefaltMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
