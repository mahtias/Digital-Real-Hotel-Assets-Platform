import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { IconLock, IconLogo, IconUser } from "../components/Icons";

export default function Login() {
  const { login } = useAdminAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/");
    } catch (err: any) {
      // Generic message — never reveal whether user exists
      setError("Invalid credentials or insufficient permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row rounded-md overflow-hidden shadow-card border border-line">
          {/* Login card */}
          <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 sm:p-10">
            <h1 className="text-3xl font-medium mb-1">Login</h1>
            <p className="text-medium-emphasis mb-6">Sign in to your admin account</p>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <div className="input-group mb-3">
              <span className="input-group-text"><IconUser size={18} /></span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control py-2"
                placeholder="admin@digirealassets.io"
                aria-label="Email"
              />
            </div>

            <div className="input-group mb-6">
              <span className="input-group-text"><IconLock size={18} /></span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control py-2"
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary px-5 py-2">
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {/* Brand panel */}
          <div className="md:w-[44%] bg-primary text-white p-8 sm:p-10 flex flex-col items-center justify-center text-center">
            <IconLogo size={56} className="mb-4 opacity-90" />
            <h2 className="text-2xl font-medium text-white mb-2">DRA Admin Panel</h2>
            <p className="text-sm text-white/80 max-w-xs">
              This portal is restricted to authorised DigiRealAssets administrators.
              All access attempts are logged.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 border border-white/30 rounded-md px-3 py-1.5">
              <IconLock size={14} /> Authorised access only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
