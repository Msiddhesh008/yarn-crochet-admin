import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-transparent.png'
import { useAuth } from '../context/AuthContext'
import { TextField } from '../components/form/FormControls'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('hello@yarn.studio')
  const [password, setPassword] = useState('handmade')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    login(email, password)
      .then((ok) => {
        if (!ok) {
          setError('Invalid email or password.')
          return
        }
        navigate('/')
      })
      .catch(() => {
        setError('Could not reach the API. Is the server running?')
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <img src={logo} alt="Yarn" className="login-card__logo" />
        <h1>Studio desk</h1>
        <p className="page-sub">Manage pieces, orders, and little stories.</p>
        {error ? <p className="login-error">{error}</p> : null}
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="username"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="btn btn--primary"
          style={{ width: '100%' }}
          disabled={submitting}
        >
          {submitting ? 'Signing in…' : 'Enter dashboard'}
        </button>
      </form>
    </div>
  )
}
