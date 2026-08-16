import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GithubCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const { githubLogin } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = sessionStorage.getItem('gh_oauth_state');
      sessionStorage.removeItem('gh_oauth_state');

      if (!code || !state || state !== savedState) {
        setError('Invalid GitHub authorization response. Please try signing in again.');
        return;
      }
      const result = await githubLogin(code);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    };
    run();
  }, [searchParams, githubLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background blueprint-grid px-4">
      <div className="border-2 border-border p-8 bg-card text-center max-w-sm w-full">
        {error ? (
          <>
            <p className="text-sm text-destructive mb-4" data-testid="github-callback-error">{error}</p>
            <Link to="/login" className="text-sm text-primary hover:underline font-mono uppercase tracking-wider">
              Back to Login
            </Link>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-mono uppercase tracking-wider text-foreground">Signing in with GitHub&hellip;</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubCallbackPage;
