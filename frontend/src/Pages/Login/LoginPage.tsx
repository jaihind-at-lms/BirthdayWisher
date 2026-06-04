import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { JSX } from 'react'

import Input from '@project/Components/Form/Input'
import { getDefaultPathForRole } from '@project/Routes/paths'
import { type LoginFormValues, loginSchema } from '@project/Schemas/auth.schema'
import { useLoginMutation } from '@project/Store/Api'

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      // unwrap() resolves with the value returned by transformResponse.
      // onQueryStarted in auth.api.ts also dispatches setUserLoginData,
      // but we read role directly from the result here — not from the selector —
      // because React state updates are async and the selector would be stale.
      const { role } = await login({ ...values, expiresInMins: 30 }).unwrap()
      void navigate(getDefaultPathForRole(role), { replace: true })
    } catch {
      // API errors are handled by baseQuery's toast — nothing to do here
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <h1 className="login-page__title">Sign In</h1>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e)
          }}
          noValidate
          className="login-page__form"
        >
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            registration={register('username')}
            error={errors.username}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            registration={register('password')}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="login-page__submit"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
