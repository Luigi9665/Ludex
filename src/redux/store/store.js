import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import loginReducer from "../reducer/loginReducer";
import userReducer from "../reducer/userReducer";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: loginReducer,
  userData: userReducer,
});

const persisterReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisterReducer,
  middleware: (getDefaltMiddleware) => getDefaltMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
