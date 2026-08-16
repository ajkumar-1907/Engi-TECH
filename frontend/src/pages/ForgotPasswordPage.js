import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 blueprint-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl tracking-tighter font-medium text-foreground mb-3 font-display">
            Reset your password
          </h1>
          <p className="text-sm leading-relaxed text-secondary font-mono">
            Enter your account email and we'll send you a reset link.
          </p>
        </div>

        <div className="reg-corners border-2 border-border rounded-none p-4 sm:p-6 bg-card relative">
          <span className="reg-tr" /><span className="reg-bl" />
          {message ? (
            <div className="text-center py-4" data-testid="forgot-password-success">
              <p className="text-sm text-foreground mb-4">{message}</p>
              <Link to="/login" className="text-sm text-primary hover:underline font-mono uppercase tracking-wider">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="forgot-email" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 rounded-none border-border focus:border-primary"
                  data-testid="forgot-email-input"
                />
              </div>
              {error && (
                <div className="border border-destructive bg-destructive/5 p-3 rounded-none" data-testid="forgot-password-error">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium px-6 py-3"
                disabled={loading}
                data-testid="forgot-password-submit"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
