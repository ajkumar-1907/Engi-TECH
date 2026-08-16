import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const { verifyEmail } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing its token.');
      return;
    }
    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background blueprint-grid px-4">
      <div className="border-2 border-border p-8 bg-card text-center max-w-sm w-full" data-testid="verify-email-status">
        {status === 'verifying' && (
          <div className="flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-mono uppercase tracking-wider text-foreground">Verifying&hellip;</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <p className="text-sm text-foreground mb-4">{message}</p>
            <Link to="/" className="text-sm text-primary hover:underline font-mono uppercase tracking-wider">
              Go to EngiTech
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-sm text-destructive mb-4">{message}</p>
            <Link to="/login" className="text-sm text-primary hover:underline font-mono uppercase tracking-wider">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
