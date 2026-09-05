import { Bell, Database, Globe2, ShieldCheck, User } from "lucide-react";
import PageHead from "../components/PageHead";
import { useAuth } from "../auth/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  return <>
    <PageHead eyebrow="ACCOUNT" title="Settings" subtitle="Your authenticated account and application preferences." />
    <div className="grid gap-5 lg:grid-cols-[.65fr_1.35fr]">
      <nav className="grid content-start gap-2">
        <button className="flex items-center gap-3 rounded-2xl border border-farm-100 bg-farm-100 px-4 py-4 text-left text-sm font-bold text-farm-900"><User className="h-5 w-5" />Profile</button>
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold"><Bell className="h-5 w-5" />Notifications</button>
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold"><Database className="h-5 w-5" />Data & model</button>
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold"><Globe2 className="h-5 w-5" />Language</button>
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold"><ShieldCheck className="h-5 w-5" />Privacy</button>
      </nav>
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold">Profile information</h2>
        <p className="mt-1 text-sm text-slate-500">Loaded securely from your authenticated Node.js session.</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Profile label="Full name" value={user?.name || ""} />
          <Profile label="Email address" value={user?.email || ""} />
          <Profile label="Account ID" value={user?.id || ""} />
          <Profile label="Joined" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""} />
        </div>
        <div className="mt-7 rounded-2xl bg-farm-50 p-5 text-sm leading-6 text-farm-900">
          <strong className="block">Security enabled</strong>
          Password bcrypt se hashed hai aur login token JavaScript-readable storage ke badle HttpOnly cookie mein rakha gaya hai.
        </div>
      </section>
    </div>
  </>;
}

function Profile({ label, value }) {
  return <label className="text-sm font-semibold text-slate-700">{label}<input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600" value={value} readOnly /></label>;
}
