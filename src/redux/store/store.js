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
});

const persisterReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisterReducer,
  middleware: (getDefaltMiddleware) => getDefaltMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
