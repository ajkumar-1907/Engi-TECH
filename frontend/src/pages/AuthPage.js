import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [socialError, setSocialError] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  const handleGoogleResponse = async (googleResponse) => {
    setSocialError('');
    setSocialLoading(true);
    const result = await googleLogin(googleResponse.credential);
    if (result.success) {
      navigate('/');
    } else {
      setSocialError(result.error);
    }
    setSocialLoading(false);
  };

  useEffect(() => {
    if (window.google?.accounts?.id && googleBtnRef.current && process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 336, text: 'continue_with',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGithubLogin = () => {
    const state = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);
    sessionStorage.setItem('gh_oauth_state', state);
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
      redirect_uri: process.env.REACT_APP_GITHUB_REDIRECT_URI || '',
      scope: 'read:user user:email',
      state,
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const result = await login(loginEmail, loginPassword, rememberMe);
    if (result.success) {
      navigate('/');
    } else {
      setLoginError(result.error);
    }
    setLoginLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterLoading(true);
    const result = await register(registerEmail, registerPassword, registerName);
    if (result.success) {
      navigate('/');
    } else {
      setRegisterError(result.error);
    }
    setRegisterLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 blueprint-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="13" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <circle cx="15" cy="15" r="4.5" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              <line x1="15" y1="0" x2="15" y2="7" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <line x1="15" y1="23" x2="15" y2="30" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <line x1="0" y1="15" x2="7" y2="15" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <line x1="23" y1="15" x2="30" y2="15" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tighter font-medium text-foreground mb-3 sm:mb-4 font-display" data-testid="auth-title">
            Engi<span className="text-primary">Tech</span>
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-secondary font-mono" data-testid="auth-subtitle">
            Engineering Equipment Reference Platform
          </p>
        </div>

        <div className="mb-4 sm:mb-6 space-y-3">
          <div className="flex justify-center" ref={googleBtnRef} data-testid="google-signin-button" />
          <Button
            type="button"
            onClick={handleGithubLogin}
            disabled={socialLoading}
            variant="outline"
            className="w-full rounded-none border-2 border-border font-mono uppercase tracking-wider text-xs py-3"
            data-testid="github-signin-button"
          >
            Continue with GitHub
          </Button>
          {socialError && (
            <div className="border border-destructive bg-destructive/5 p-3 rounded-none" data-testid="social-error">
              <p className="text-sm text-destructive">{socialError}</p>
            </div>
          )}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono uppercase tracking-wider text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-2 border-border mb-4 sm:mb-6 font-mono uppercase tracking-wider text-xs">
            <TabsTrigger value="login" className="rounded-none" data-testid="login-tab">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none" data-testid="register-tab">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="reg-corners border-2 border-border rounded-none p-4 sm:p-6 bg-card relative">
              <span className="reg-tr" /><span className="reg-bl" />
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="login-email" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="mt-2 rounded-none border-border focus:border-primary"
                    data-testid="login-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="mt-2 rounded-none border-border focus:border-primary"
                    data-testid="login-password-input"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-mono" data-testid="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-2 border-border rounded-none focus:ring-primary"
                    data-testid="remember-me-checkbox"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-secondary">
                    Keep me signed in (30 days)
                  </label>
                </div>
                {loginError && (
                  <div className="border border-destructive bg-destructive/5 p-3 rounded-none" data-testid="login-error">
                    <p className="text-sm text-destructive">{loginError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium px-6 py-3"
                  disabled={loginLoading}
                  data-testid="login-submit-button"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="reg-corners border-2 border-border rounded-none p-4 sm:p-6 bg-card relative">
              <span className="reg-tr" /><span className="reg-bl" />
              <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="register-name" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="mt-2 rounded-none border-border focus:border-primary"
                    data-testid="register-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="mt-2 rounded-none border-border focus:border-primary"
                    data-testid="register-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="mt-2 rounded-none border-border focus:border-primary"
                    data-testid="register-password-input"
                  />
                </div>
                {registerError && (
                  <div className="border border-destructive bg-destructive/5 p-3 rounded-none" data-testid="register-error">
                    <p className="text-sm text-destructive">{registerError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium px-6 py-3"
                  disabled={registerLoading}
                  data-testid="register-submit-button"
                >
                  {registerLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 sm:mt-6 text-center">
          <Link to="/" className="text-sm text-primary hover:underline" data-testid="back-home-link">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
