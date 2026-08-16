import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 blueprint-grid">
        <div className="border-2 border-border p-8 bg-card text-center max-w-sm w-full">
          <p className="text-sm text-destructive mb-4">This reset link is missing its token.</p>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline font-mono uppercase tracking-wider">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 blueprint-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl tracking-tighter font-medium text-foreground mb-3 font-display">
            Choose a new password
          </h1>
        </div>

        <div className="reg-corners border-2 border-border rounded-none p-4 sm:p-6 bg-card relative">
          <span className="reg-tr" /><span className="reg-bl" />
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="new-password" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 rounded-none border-border focus:border-primary"
                data-testid="reset-new-password-input"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 rounded-none border-border focus:border-primary"
                data-testid="reset-confirm-password-input"
              />
            </div>
            {error && (
              <div className="border border-destructive bg-destructive/5 p-3 rounded-none" data-testid="reset-password-error">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium px-6 py-3"
              disabled={loading}
              data-testid="reset-password-submit"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
