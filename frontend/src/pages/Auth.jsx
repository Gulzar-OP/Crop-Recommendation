import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, LoaderCircle, Sprout } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export function Login() { return <AuthForm type="login" />; }
export function Register() { return <AuthForm type="register" />; }

function AuthForm({ type }) {
  const isRegister = type === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await (isRegister ? register(form) : login({ email: form.email, password: form.password }));
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-farm-500 focus:bg-white focus:ring-4 focus:ring-farm-100";
  return (
    <main className="grid min-h-screen bg-farm-50 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-farm-900 p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><Sprout /></span>
          <div><strong className="block text-xl">KrishiMitra AI</strong><span className="text-sm text-emerald-100/70">Crop intelligence platform</span></div>
        </div>
        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-bold uppercase tracking-[.24em] text-emerald-300">Python ML + MERN</p>
          <h1 className="text-5xl font-bold leading-tight">Better crop decisions begin with your soil.</h1>
          <p className="mt-6 text-lg leading-8 text-emerald-100/70">ANN-based prediction, secure user accounts and recommendation history—all in one dashboard.</p>
        </div>
        <p className="relative text-sm text-emerald-100/50">TensorFlow · Node.js · MongoDB · React</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-emerald-950/10 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-farm-100 text-farm-700"><Leaf /></span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">{isRegister ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{isRegister ? "Save personalized crop recommendations securely." : "Login to open your crop intelligence dashboard."}</p>

          {isRegister && <label className="mt-7 block text-sm font-semibold text-slate-700">Full name<input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} minLength="2" required /></label>}
          <label className="mt-5 block text-sm font-semibold text-slate-700">Email address<input className={inputClass} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="mt-5 block text-sm font-semibold text-slate-700">Password<input className={inputClass} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength="8" maxLength="72" required /></label>

          {error && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button disabled={loading} className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-farm-900 font-bold text-white transition hover:bg-farm-700 disabled:opacity-60">
            {loading ? <><LoaderCircle className="h-5 w-5 animate-spin" />Please wait...</> : isRegister ? "Create account" : "Login"}
          </button>
          <p className="mt-6 text-center text-sm text-slate-500">{isRegister ? "Already registered?" : "New to KrishiMitra?"} <Link className="font-bold text-farm-700 hover:underline" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create account"}</Link></p>
        </form>
      </section>
    </main>
  );
}
