import { useState } from "react";
import { Shield, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CyberBackground from "../components/ui/CyberBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("analyst@soc.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    try {
      login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <CyberBackground />
      <form
        onSubmit={onSubmit}
        className="glass-panel relative z-10 w-full max-w-md rounded-2xl p-6 shadow-[0_0_40px_rgba(0,213,255,0.15)]"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
            <Shield className="h-6 w-6 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-semibold">SOC Analyst Login</h1>
          <p className="mt-1 text-sm text-slate-400">Access CyberSentinel SIEM dashboard</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 inline-block text-slate-300">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-950/60 px-3 py-2">
              <Mail className="h-4 w-4 text-cyan-300" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                type="email"
              />
            </div>
          </label>
          <label className="block text-sm">
            <span className="mb-1 inline-block text-slate-300">Password</span>
            <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-950/60 px-3 py-2">
              <Lock className="h-4 w-4 text-cyan-300" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                type="password"
              />
            </div>
          </label>
        </div>

        {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Secure Login
        </button>
      </form>
    </div>
  );
}
