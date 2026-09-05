import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CloudRain,
  FlaskConical,
  Leaf,
  MapPin,
  Plus,
  Sprout,
  TrendingUp,
} from "lucide-react";
import PageHead from "../components/PageHead";
import { getHistory } from "../api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getHistory()
      .then((data) => setItems(data.items))
      .catch(() => {});
  }, []);
  const summary = useMemo(() => {
    const crops = new Set(items.map((item) => item.recommended_crop));
    const fields = new Set(
      items.map((item) => item.field_name).filter(Boolean),
    );
    const average = items.length
      ? Math.round(
          items.reduce((sum, item) => sum + item.confidence, 0) / items.length,
        )
      : 0;
    return { crops: crops.size, fields: fields.size, average };
  }, [items]);

  return (
    <>
      <PageHead
        eyebrow="FARM OVERVIEW"
        title="Your crop intelligence dashboard"
        subtitle="Live recommendation records from your MongoDB account."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<FlaskConical />}
          value={items.length}
          label="Soil analyses"
        />
        <Stat
          icon={<Sprout />}
          value={summary.crops}
          label="Crops recommended"
        />
        <Stat
          icon={<TrendingUp />}
          value={summary.average + "%"}
          label="Avg. confidence"
        />
        <Stat icon={<MapPin />} value={summary.fields} label="Active fields" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent recommendations</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest ANN analyses saved by Node.js
              </p>
            </div>
            <Link className="text-sm font-bold text-farm-700" to="/history">
              View all →
            </Link>
          </div>
          {items.length === 0 ? (
            <div className="grid min-h-48 place-items-center rounded-2xl bg-farm-50 text-center text-sm text-slate-500">
              No recommendation yet.
              <br />
              Run your first soil analysis.
            </div>
          ) : (
            items.slice(0, 4).map((item) => (
              <div
                className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-slate-50 p-4"
                key={item.id}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-farm-100 text-farm-700">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block capitalize">
                    {item.recommended_crop}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {item.field_name || "Unnamed field"} ·{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <strong className="text-farm-700">
                  {item.confidence}%
                  <small className="block text-[10px] uppercase text-slate-400">
                    confidence
                  </small>
                </strong>
              </div>
            ))
          )}
        </section>
        <aside>
          <div className="rounded-3xl bg-farm-900 p-6 text-white">
            <CloudRain className="float-right text-emerald-200" />
            <p className="text-xs font-bold tracking-widest text-emerald-200">
              TODAY'S WEATHER
            </p>
            <h2 className="mt-5 text-4xl font-bold">29°C</h2>
            <p className="mt-1 text-sm text-white/60">Partly cloudy · Haldia</p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
              <span className="rounded-xl bg-white/10 p-3">
                82%<small className="block text-white/50">Humidity</small>
              </span>
              <span className="rounded-xl bg-white/10 p-3">
                12 km/h<small className="block text-white/50">Wind</small>
              </span>
              <span className="rounded-xl bg-white/10 p-3">
                18 mm<small className="block text-white/50">Rain</small>
              </span>
            </div>
          </div>
          <Link
            className="mt-4 flex h-13 items-center justify-center gap-2 rounded-2xl bg-farm-900 font-bold text-white"
            to="/recommend"
          >
            <Plus className="h-5 w-5" />
            New recommendation
          </Link>
        </aside>
      </div>
    </>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-farm-100 text-farm-700">
        {icon}
      </span>
      <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-slate-400" />
      <h2 className="mt-5 text-3xl font-bold">{value}</h2>
      <strong className="mt-1 block text-sm">{label}</strong>
      <span className="text-xs text-slate-400">From saved history</span>
    </div>
  );
}
