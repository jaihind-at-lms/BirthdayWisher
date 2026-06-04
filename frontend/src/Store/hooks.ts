import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux'

import type { AppDispatch, AppStore, RootState } from './store'

/**
 * Typed dispatch hook — use instead of plain `useDispatch`.
 * Preserves thunk and RTK Query action types.
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * Typed selector hook — use instead of plain `useSelector`.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Typed store hook — use when you need direct store access (rare).
 */
export const useAppStore: () => AppStore = useStore
