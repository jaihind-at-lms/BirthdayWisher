# React Boilerplate

A production-ready React boilerplate with role-based access control, RTK Query, Redux Persist, React Hook Form + Zod, and a strict code quality setup.

---

## Tech Stack

| Layer         | Library                                |
| ------------- | -------------------------------------- |
| UI            | React 19, TypeScript 5                 |
| Routing       | React Router v7                        |
| State         | Redux Toolkit + Redux Persist          |
| API           | RTK Query + Axios                      |
| Forms         | React Hook Form + Zod                  |
| Styling       | SCSS (Sass)                            |
| Notifications | React Toastify                         |
| Linting       | ESLint + Prettier + Husky + Commitlint |
| Build         | Vite + SWC                             |

---

## Getting Started

**1. Clone and install**

```bash
yarn install
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_PORT=7000
VITE_ROUTER_BASE_PATH="/"
VITE_API_BASE_URL=https://your-api-url.com
VITE_APP_SECRET_KEY=your-secret-key-here
```

**3. Run dev server**

```bash
yarn dev
```

**4. Build for production**

```bash
yarn build
```

---

## Project Structure

```
src/
├── Components/         # Reusable UI components
│   ├── Layouts/        # AdminLayout, MainLayout
│   ├── Form/           # FormField (RHF-wired input)
│   ├── Header/
│   ├── Footer/
│   └── ErrorBoundary/
├── Pages/              # Route-level page components
│   ├── Admin/
│   ├── Dashboard/
│   ├── Login/
│   ├── Manager/
│   ├── Profile/
│   └── Errors/
├── Routes/             # Routing, guards, layout renderer
│   ├── guards/         # ProtectedRoute, RoleGuard, GuestRoute
│   ├── AppRoutes.tsx
│   ├── LayoutRenderer.tsx
│   ├── paths.ts        # All URL paths as constants
│   └── routeConfig.ts  # Single source of truth for all routes
├── Schemas/            # Zod validation schemas
├── Store/
│   ├── Api/            # RTK Query API slices
│   ├── Feature/        # Redux slices (state + selectors)
│   ├── hooks.ts        # Typed useAppDispatch / useAppSelector
│   └── store.ts        # Store config + redux-persist setup
├── Types/              # TypeScript interfaces and types
└── Utils/              # Pure utility functions
```

---

## Creating a New Component

1. Create a folder under `src/Components/YourComponent/`
2. Add `YourComponent.tsx` and an `index.ts` barrel export

```tsx
// src/Components/YourComponent/YourComponent.tsx
import type { JSX } from 'react'

interface YourComponentProps {
  title: string
}

const YourComponent = ({ title }: YourComponentProps): JSX.Element => (
  <div className="your-component">{title}</div>
)

export default YourComponent
```

```ts
// src/Components/YourComponent/index.ts
export { default } from './YourComponent'
```

Import it anywhere:

```tsx
import YourComponent from '@project/Components/YourComponent'
```

---

## Creating a New Page

1. Create a folder under `src/Pages/YourFeature/`
2. Add the page component:

```tsx
// src/Pages/YourFeature/YourFeaturePage.tsx
import type { JSX } from 'react'

const YourFeaturePage = (): JSX.Element => <div>Your Feature</div>

export default YourFeaturePage
```

3. Register it in `src/Routes/routeConfig.ts` (see Adding a Route below)

---

## Adding a Route

All routes live in `src/Routes/routeConfig.ts`. Guards, layouts, and nav menus all derive from this config automatically.

**Step 1** — Add the path to `src/Routes/paths.ts`:

```ts
export const AppPaths = {
  // ...existing
  YOUR_FEATURE: '/your-feature',
} as const
```

**Step 2** — Add a lazy import and entry in `src/Routes/routeConfig.ts`:

```ts
const YourFeaturePage = lazy(
  () => import('@project/Pages/YourFeature/YourFeaturePage')
)

export const protectedRoutes: RouteConfig[] = [
  // ...existing
  {
    path: AppPaths.YOUR_FEATURE,
    component: YourFeaturePage,
    layout: 'main', // 'main' | 'admin' | 'none'
    label: 'Your Feature',
    icon: 'your-icon',
    showInNav: true,
    roles: [AppRole.ADMIN], // omit roles -> all authenticated users can access
  },
]
```

No changes needed in `AppRoutes.tsx`.

---

## Role Management

Roles are defined in `src/Types/features/auth.ts`:

```ts
export const AppRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const
```

**To add a new role:**

1. Add it to `AppRole` — TypeScript propagates it everywhere
2. Add its default landing path in `src/Routes/paths.ts`:

```ts
export const ROLE_DEFAULT_PATHS: Record<AppRoleType, string> = {
  // ...existing
  [AppRole.YOUR_ROLE]: AppPaths.YOUR_FEATURE,
}
```

3. Assign it to routes via the `roles` array in `routeConfig.ts`

**How guards work:**

- `ProtectedRoute` — blocks unauthenticated users, redirects to `/login`
- `RoleGuard` — checks `roles[]` from route config, redirects to `/unauthorized` on mismatch
- `GuestRoute` — prevents logged-in users from hitting `/login`, redirects to their default page

**Testing a role during development** — change `role` on `MOCK_USER` in `src/Store/Api/auth.api.ts`:

```ts
role: AppRole.ADMIN, // change to test different role flows
```

Remove `MOCK_USER` entirely when connecting a real API.

---

## Adding a New API Call

**Step 1** — Create `src/Store/Api/yourFeature.api.ts`:

```ts
import { createApi } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '@project/Types/api'
import axiosBaseQuery from './baseQuery'

const yourFeatureApi = createApi({
  reducerPath: 'yourFeatureApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['YourTag'],
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => ({ url: 'items', method: 'GET', showErrorMessage: true }),
      transformResponse: (res: ApiResponse<Item[]>) => res.data,
      providesTags: ['YourTag'],
    }),
    createItem: builder.mutation<Item, Partial<Item>>({
      query: (data) => ({
        url: 'items',
        method: 'POST',
        data,
        showResultMessage: true,
      }),
      transformResponse: (res: ApiResponse<Item>) => res.data,
      invalidatesTags: ['YourTag'],
    }),
  }),
})

export const { useGetItemsQuery, useCreateItemMutation } = yourFeatureApi
export default yourFeatureApi
```

**Step 2** — Register in `src/Store/store.ts`:

```ts
import yourFeatureApi from './Api/yourFeature.api'

const apiSlices = [authApi, yourFeatureApi] as const

const rootReducer = combineReducers({
  [authSlice.name]: persistedAuthReducer,
  [authApi.reducerPath]: authApi.reducer,
  [yourFeatureApi.reducerPath]: yourFeatureApi.reducer,
})
```

**Step 3** — Export from `src/Store/Api/index.ts`:

```ts
export * from './yourFeature.api'
```

**Step 4** — Use in a component:

```tsx
import { useGetItemsQuery } from '@project/Store/Api'

const { data, isLoading, isError } = useGetItemsQuery()
```

**`AxiosQueryArgs` options:**

| Option                 | Default           | Description                      |
| ---------------------- | ----------------- | -------------------------------- |
| `url`                  | required          | Endpoint path                    |
| `method`               | required          | HTTP method                      |
| `data`                 | —                 | Request body                     |
| `params`               | —                 | Query params                     |
| `showResultMessage`    | `false`           | Show success toast on 200/204    |
| `showErrorMessage`     | `true`            | Show error toast on failure      |
| `responseType: 'blob'` | —                 | Triggers automatic file download |
| `downloadFileName`     | `'download.xlsx'` | File name for blob download      |

**Connecting a real API** — update `transformResponse` per endpoint:

```ts
// Wrapped response: { data: T, message: string, status: number }
transformResponse: (res: ApiResponse<YourType>) => res.data

// Flat response
transformResponse: (res: YourType) => res
```

---

## Managing Redux Slices

**Creating a new slice:**

```ts
// src/Store/Feature/yourFeature.slice.ts
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '@project/Store/store'

interface YourFeatureState {
  items: Item[]
}

const initialState: YourFeatureState = { items: [] }

const yourFeatureSlice = createSlice({
  name: 'yourFeature',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload
    },
  },
})

export const { setItems } = yourFeatureSlice.actions

const selectYourFeature = (state: RootState) => state.yourFeature
export const selectItems = createSelector(selectYourFeature, (s) => s.items)

export default yourFeatureSlice
```

**Register in `src/Store/store.ts`:**

```ts
import yourFeatureSlice from './Feature/yourFeature.slice'

const rootReducer = combineReducers({
  // ...existing
  [yourFeatureSlice.name]: yourFeatureSlice.reducer,
})
```

**Export from `src/Store/Feature/index.ts`:**

```ts
export * from './yourFeature.slice'
```

**Use in components with typed hooks:**

```tsx
import { useAppDispatch, useAppSelector } from '@project/Store/hooks'
import { selectItems, setItems } from '@project/Store/Feature'

const dispatch = useAppDispatch()
const items = useAppSelector(selectItems)

dispatch(setItems([...]))
```

**Persisting slice state** — wrap the reducer in `persistReducer` in `store.ts` (same pattern as `authPersistConfig`). Use `sessionStorage` for sensitive data, `localStorage` for preferences.

**Resetting all state** — dispatch `resetStore()` from `@project/Store/Feature`. Wipes the entire store back to initial values (used on logout).

---

## Forms with Zod + React Hook Form

**Step 1** — Define schema in `src/Schemas/yourFeature.schema.ts`:

```ts
import { z } from 'zod'
import validationMessages from '@project/Utils/validationMessages'

export const yourSchema = z.object({
  email: z
    .string()
    .min(1, validationMessages.email.required)
    .email(validationMessages.email.invalid),
  name: z.string().min(3, validationMessages.name.min),
})

export type YourFormValues = z.infer<typeof yourSchema>
```

**Step 2** — Use in a page:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '@project/Components/Form/FormField'
import {
  yourSchema,
  type YourFormValues,
} from '@project/Schemas/yourFeature.schema'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<YourFormValues>({
  resolver: zodResolver(yourSchema),
  mode: 'onTouched',
})

const onSubmit = (values: YourFormValues) => {
  /* call API */
}

return (
  <form
    onSubmit={(e) => {
      void handleSubmit(onSubmit)(e)
    }}
  >
    <FormField
      label="Email"
      type="email"
      registration={register('email')}
      error={errors.email}
    />
  </form>
)
```

Add new validation message keys to `src/Utils/validationMessages.ts` to keep error copy centralised.

---

## Layouts

Two layouts are available, selected per-route via the `layout` key in `routeConfig.ts`:

| Key       | Component     | Used for                   |
| --------- | ------------- | -------------------------- |
| `'main'`  | `MainLayout`  | Header + content + Footer  |
| `'admin'` | `AdminLayout` | Header + sidebar + content |
| `'none'`  | Raw `Outlet`  | Error pages, login         |

To create a new layout:

1. Add `src/Components/Layouts/YourLayout.tsx`
2. Add a case to `src/Routes/LayoutRenderer.tsx`
3. Use the new key in `routeConfig.ts`

---

## Utilities

Import from the specific module, not from `utility.ts` (deprecated barrel):

| Module                              | What it provides                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `@project/Utils/browserStorage`     | `setSessionStorage`, `getSessionStorage`, `setLocalStorage`, `getLocalStorage`, `removeSessionStorage`, `clearLocalStorage` |
| `@project/Utils/notificationPopup`  | `showSuccessToast`, `showErrorToast`, `showWarningToast`                                                                    |
| `@project/Utils/stringUtils`        | `capitalizeFirstLetter`, `removeUnderScore`, `toLowerCase`, `ensureHTTPS`, `parseAndReplaceLinks`, `createMarkup`           |
| `@project/Utils/dateUtils`          | `formatTime`, `generateYears`, `pastDate`, `isEndDateAfterTwoDays`                                                          |
| `@project/Utils/constant`           | `HttpStatus`, `HttpMethod` enums                                                                                            |
| `@project/Utils/validationMessages` | Centralised form error copy                                                                                                 |

---

## Connecting a Real Backend

The boilerplate ships with a mock user so the full auth + role flow works without a backend. When your API is ready:

1. **Remove `MOCK_USER`** from `src/Store/Api/auth.api.ts`
2. **Update `transformResponse`** in `login`, `logout`, `getProfile`, `updateProfile` to match your response shape
3. **Update endpoint URLs** (`auth/login`, `auth/logout`, `auth/me`, `auth/refresh`) to match your API
4. **Update `VITE_API_BASE_URL`** in `.env`
5. If your login response shape differs from `LoginResponse`, update `src/Types/features/auth.ts` accordingly

---

## Code Quality

```bash
yarn lint          # ESLint check
yarn lint:fix      # ESLint auto-fix
yarn format        # Prettier format
yarn folderslint   # Enforce folder naming conventions
```

Commits are linted via Commitlint (conventional commits). Husky runs lint-staged on pre-commit.

Commit format: `type(scope): message`
Examples: `feat(auth): add refresh token`, `fix(routes): correct admin redirect`
