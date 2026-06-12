import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import Icon from '../components/Icon';
import { Button, Input } from '../components/ui';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) setError('This reset link is incomplete. Request a new one.');
    else if (password.length < 8) setError('Password must be at least 8 characters');
    else if (password !== confirmation) setError('Passwords do not match');
    else {
      setLoading(true);
      setError('');
      try {
        await resetPassword(token, password);
        setComplete(true);
      } catch (requestError) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 400) {
          setError('This reset link is invalid or has expired. Request a new one.');
        } else {
          setError('We could not reset your password. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <AuthLayout>
      <p className="auth-kicker">Secure reset</p>
      <h1 className="auth-title">Choose a new password</h1>
      <p className="auth-subtitle">Use at least eight characters you do not use elsewhere.</p>

      {complete ? (
        <>
          <div className="auth-note alert-success">
            <Icon name="check" size={18} /> Your password has been updated. You can now sign in with the new one.
          </div>
          <Link to="/login" className="btn btn-primary w-full auth-action-link">Continue to sign in</Link>
        </>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setError(''); }}
            error={error}
            autoComplete="new-password"
            autoFocus
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="Repeat your password"
            value={confirmation}
            onChange={(event) => { setConfirmation(event.target.value); setError(''); }}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Update password <Icon name="arrow-right" size={16} />
          </Button>
        </form>
      )}

      {!token && <p className="auth-subtitle"><Link to="/forgot-password">Request a new reset link</Link></p>}
    </AuthLayout>
  );
}
