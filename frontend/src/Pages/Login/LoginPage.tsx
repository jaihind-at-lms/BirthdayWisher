import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Lock } from 'lucide-react'
import type { JSX } from 'react'

import illustration from '@project/assets/images/mail-sent-illustration.png'
import Button from '@project/Components/Form/Button'
import Input from '@project/Components/Form/Input'
import { getDefaultPathForRole } from '@project/Routes/paths'
import { type LoginFormValues, loginSchema } from '@project/Schemas/auth.schema'
import { useLoginMutation } from '@project/Store/Api'

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [login, { isLoading, error }] = useLoginMutation()

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
      const { role } = await login({ ...values, expiresInMins: 30 }).unwrap()
      void navigate(getDefaultPathForRole(role), { replace: true })
    } catch {
      // handled by baseQuery toast
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column overflow-hidden">
      <div className="row py-3 px-lg-5 px-3">
        <div className="col">
          <img src="https://lmsin.com/images/lms-logo.png" alt="Logo" height={45} />
        </div>
      </div>

      <div className="row flex-grow-1 align-items-center">
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center text-center">
          <div className="position-relative">
            <div
              className="position-absolute top-50 start-50 translate-middle rounded-circle"
              style={{
                width: '300px',
                height: '300px',
                background: 'rgba(111,66,193,.15)',
                filter: 'blur(60px)',
                zIndex: 0,
              }}
            />
            <img
              src={illustration}
              className="img-fluid position-relative"
              style={{ maxHeight: '360px', zIndex: 1 }}
              alt="Illustration"
            />
          </div>
          <h1 className="fw-bold display-6 mt-4 mb-0">
            HR Mail Automation
          </h1>
          <h1 className="fw-bold display-6">
            Made <span className="text-info">Effortless</span>
          </h1>
          <p className="text-secondary mt-3 w-75">
            Automate welcome emails, birthday wishes, and more —
            so you can focus on what matters most: your people.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9 col-md-7">
              <div className="card border-0 shadow-lg rounded-4" style={{ borderTop: '4px solid var(--bs-info)' }}>
                <div className="card-body p-4 p-lg-5">
                  <div className="mb-3">
                    <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                      Welcome Back
                    </span>
                  </div>

                  <h2 className="fw-bold mb-2">Login</h2>
                  <p className="text-secondary mb-4">
                    Sign in to manage and automate your HR communications
                  </p>

                  {error && (
                    <div className="alert alert-danger py-2 small border-0">
                      {error && 'data' in error
                        ? (error.data as { message?: string })?.message ?? 'Please enter valid credentials'
                        : 'Please enter valid credentials'}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
                    noValidate
                  >
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <Input
                        icon={<User size={18} />}
                        type="text"
                        placeholder="Enter username"
                        autoComplete="username"
                        registration={register('username')}
                        error={errors.username}
                        className="form-control-lg"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <Input
                        icon={<Lock size={18} />}
                        type="password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        registration={register('password')}
                        error={errors.password}
                        className="form-control-lg"
                      />
                    </div>

                    <div className="d-grid">
                      <Button type="submit" loading={isLoading} className="btn-lg">
                        Login
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row border-top py-2">
        <div className="col text-center text-secondary small">
          Copyright &copy; 2026 LMS Solutions (India) Pvt. Ltd. All Rights Reserved.
        </div>
      </div>
    </div>
  )
}

export default LoginPage
