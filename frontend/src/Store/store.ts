import {
  combineReducers,
  configureStore,
  type UnknownAction,
} from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import sessionStorage from 'redux-persist/es/storage'

import authApi from './Api/auth.api'
import employeeApi from './Api/employee.api'
import sheetApi from './Api/sheet.api'
import { setStoreRef } from './Api/baseQuery'
import authSlice, { resetStore } from './Feature/auth.slice'

// ─── API slice registry ───────────────────────────────────────────────────────

const apiSlices = [authApi, employeeApi, sheetApi] as const

// ─── Persist config (auth slice only) ────────────────────────────────────────

const authPersistConfig = {
  key: 'auth',
  storage: sessionStorage,
  whitelist: [
    'accessToken',
    'refreshToken',
    'refreshTokenExpiryTime',
    'userInfo',
  ],
}

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer
)

// ─── Root reducer ─────────────────────────────────────────────────────────────

const rootReducer = combineReducers({
  [authSlice.name]: persistedAuthReducer,
  [authApi.reducerPath]: authApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [sheetApi.reducerPath]: sheetApi.reducer,
})

/**
 * Resettable root reducer.
 * Dispatching `resetStore()` wipes all state back to initial values.
 */
const resettableRootReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: UnknownAction
): ReturnType<typeof rootReducer> => {
  if (resetStore.match(action)) {
    return rootReducer(undefined, action)
  }
  return rootReducer(state, action)
}

// ─── Store ────────────────────────────────────────────────────────────────────

const isDev = import.meta.env.DEV

const store = configureStore({
  reducer: resettableRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Only run immutability checks in development
      immutableCheck: isDev,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlices.map((api) => api.middleware).flat()),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const persistor = persistStore(store)

// Initialize the store ref in baseQuery's axios interceptor
setStoreRef(store)

export default store
