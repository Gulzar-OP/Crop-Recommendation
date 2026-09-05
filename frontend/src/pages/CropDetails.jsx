import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bug,
  CalendarDays,
  CloudRain,
  Droplets,
  FlaskConical,
  Leaf,
  LoaderCircle,
  ShieldAlert,
  Sprout,
  Sun,
  Thermometer,
  TriangleAlert,
  Wheat,
} from "lucide-react";
// import { getCropDetails } from "../api";
export default function CropDetails() {
  const { cropName } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCrop() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/v1/crops/${cropName}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Crop details not found");
        }

        setCrop(data.crop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCrop();
  }, [cropName]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading crop guide...
          </p>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <TriangleAlert className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-bold">
            Crop guide unavailable
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "Crop information not found"}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = crop.trainingDatasetProfile;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HERO */}

      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-700/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to recommendation
          </button>

          <div className="relative mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-emerald-200">
                <Leaf className="h-4 w-4" />
                COMPLETE CROP GUIDE
              </div>

              <h1 className="mt-6 text-5xl font-black capitalize md:text-7xl">
                {crop.name}
              </h1>

              <p className="mt-3 text-lg italic text-emerald-200">
                {crop.scientificName}
              </p>

              <p className="mt-6 max-w-3xl text-base leading-7 text-white/70">
                {crop.overview.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Tag>{crop.category}</Tag>
                <Tag>{crop.season.general}</Tag>
                <Tag>{crop.overview.difficulty}</Tag>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-bold tracking-widest text-emerald-200">
                MODEL PROFILE
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Conditions seen in training data
              </h2>

              <p className="mt-3 text-sm text-white/60">
                These values describe the ML dataset, not guaranteed cultivation
                limits.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <DarkMetric
                  label="Temperature"
                  value={`${profile.temperature.mean}°C`}
                  icon={<Thermometer />}
                />

                <DarkMetric
                  label="Humidity"
                  value={`${profile.humidity.mean}%`}
                  icon={<Droplets />}
                />

                <DarkMetric
                  label="pH"
                  value={profile.ph.mean}
                  icon={<FlaskConical />}
                />

                <DarkMetric
                  label="Rainfall"
                  value={`${profile.rainfall.mean} mm`}
                  icon={<CloudRain />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6">
        {/* QUICK INFO */}

        <section className="-mt-7 relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<CalendarDays />}
            title="Growing Season"
            value={crop.season.general}
          />

          <InfoCard
            icon={<Sprout />}
            title="Soil"
            value={crop.soil.preferredTypes.join(", ")}
          />

          <InfoCard
            icon={<Wheat />}
            title="Crop Type"
            value={crop.category}
          />

          <InfoCard
            icon={<Sun />}
            title="Duration"
            value={crop.overview.duration}
          />
        </section>

        {/* NPK */}

        <Section title="Training Dataset NPK Profile">
          <p className="mb-5 text-sm text-slate-500">
            Ye ML training data me is crop ke observed nutrient values hain.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <NutrientCard
              symbol="N"
              name="Nitrogen"
              data={profile.N}
            />

            <NutrientCard
              symbol="P"
              name="Phosphorus"
              data={profile.P}
            />

            <NutrientCard
              symbol="K"
              name="Potassium"
              data={profile.K}
            />
          </div>
        </Section>

        {/* CLIMATE RANGE */}

        <Section title="Climate Profile">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <RangeCard
              label="Temperature"
              data={profile.temperature}
              suffix="°C"
            />

            <RangeCard
              label="Humidity"
              data={profile.humidity}
              suffix="%"
            />

            <RangeCard
              label="Soil pH"
              data={profile.ph}
            />

            <RangeCard
              label="Rainfall"
              data={profile.rainfall}
              suffix=" mm"
            />
          </div>
        </Section>

        {/* BEFORE PLANTING */}

        <Section title="Before Planting">
          <div className="grid gap-5 lg:grid-cols-2">
            <GuideCard
              title="Land Preparation"
              items={crop.landPreparation}
              icon={<Sprout />}
            />

            <GuideCard
              title="Sowing / Planting"
              items={crop.sowingOrPlanting.guidance}
              icon={<Leaf />}
              note={crop.sowingOrPlanting.note}
            />
          </div>
        </Section>

        {/* IRRIGATION + NUTRITION */}

        <Section title="Water & Nutrition Management">
          <div className="grid gap-5 lg:grid-cols-2">
            <GuideCard
              title="Irrigation"
              items={crop.irrigation.guidance}
              icon={<Droplets />}
              note={crop.irrigation.note}
            />

            <GuideCard
              title="Nutrition"
              items={crop.nutrition.guidance}
              icon={<FlaskConical />}
              note={crop.nutrition.note}
            />
          </div>
        </Section>

        {/* GROWTH STAGES */}

        <Section title="Crop Growth Journey">
          <div className="relative space-y-5">
            {crop.growthStages.map((stage, index) => (
              <div
                key={`${stage.stage}-${index}`}
                className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[160px_1fr]"
              >
                <div>
                  <span className="text-xs font-bold tracking-wider text-emerald-600">
                    STAGE {index + 1}
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {stage.stage}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {stage.when}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <h4 className="font-bold text-emerald-900">
                      What to do
                    </h4>

                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {stage.whatToDo.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-5">
                    <h4 className="font-bold text-amber-900">
                      Watch for
                    </h4>

                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {stage.watchFor.map((item) => (
                        <li key={item}>⚠ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* COMMON PROBLEMS */}

        <Section title="Common Problems">
          <div className="grid gap-5 lg:grid-cols-2">
            {crop.commonProblems.map((problem) => (
              <div
                key={problem.name}
                className="rounded-3xl border border-amber-200 bg-amber-50 p-6"
              >
                <div className="flex gap-3">
                  <TriangleAlert className="h-6 w-6 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-xs font-bold uppercase text-amber-600">
                      {problem.type}
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {problem.name}
                    </h3>
                  </div>
                </div>

                <h4 className="mt-5 text-sm font-bold">
                  Possible Causes
                </h4>

                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {problem.possibleCauses.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <h4 className="mt-5 text-sm font-bold text-emerald-800">
                  What should you do?
                </h4>

                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {problem.actions.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* DISEASES */}

        <Section title="Diseases">
          <div className="grid gap-5 md:grid-cols-2">
            {crop.diseases.map((disease) => (
              <div
                key={disease.name}
                className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm"
              >
                <Bug className="h-7 w-7 text-red-500" />

                <h3 className="mt-4 text-xl font-bold">
                  {disease.name}
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {disease.whatToDo.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* PESTS */}

        <Section title="Pest Management">
          <div className="grid gap-5 md:grid-cols-2">
            {crop.pests.map((pest) => (
              <div
                key={pest.name}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
              >
                <ShieldAlert className="h-7 w-7 text-orange-500" />

                <h3 className="mt-4 text-xl font-bold">
                  {pest.name}
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {pest.whatToDo.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* BAD SITUATIONS */}

        <Section title="Emergency / Bad Situation Guide">
          <div className="grid gap-5 lg:grid-cols-2">
            {crop.badSituations.map((situation) => (
              <div
                key={situation.condition}
                className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm"
              >
                <div className="bg-red-50 p-5">
                  <p className="text-xs font-bold tracking-wider text-red-600">
                    EMERGENCY CONDITION
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-red-950">
                    {situation.condition}
                  </h3>

                  <p className="mt-3 text-sm text-red-800">
                    {situation.risk}
                  </p>
                </div>

                <div className="p-5">
                  <h4 className="font-bold">Immediate action</h4>

                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {situation.immediateActions.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>

                  <h4 className="mt-6 font-bold">
                    After the situation
                  </h4>

                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {situation.afterCondition.map((item) => (
                      <li key={item}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* HARVEST */}

        <Section title="Harvesting">
          <GuideCard
            title={`Harvesting ${crop.name}`}
            items={crop.harvesting.guidance}
            icon={<Wheat />}
          />
        </Section>

        {/* DOS AND DONTS */}

        <Section title="Important Do's & Don'ts">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-bold text-emerald-900">
                ✓ Do
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {crop.dos.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <h3 className="text-xl font-bold text-red-900">
                ✕ Don't
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {crop.donts.map((item) => (
                  <li key={item}>✕ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-black text-slate-900">
        {title}
      </h2>

      {children}
    </section>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm">
      {children}
    </span>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-emerald-600">{icon}</div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function DarkMetric({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <div className="text-emerald-300">{icon}</div>

      <p className="mt-3 text-xs text-white/50">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}

function NutrientCard({ symbol, name, data }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800">
        {symbol}
      </div>

      <h3 className="mt-4 font-bold">
        {name}
      </h3>

      <p className="mt-3 text-3xl font-black">
        {data.mean}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Average training value
      </p>

      <div className="mt-4 flex justify-between text-xs text-slate-500">
        <span>Min: {data.min}</span>
        <span>Max: {data.max}</span>
      </div>
    </div>
  );
}

function RangeCard({ label, data, suffix = "" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {data.mean}
        {suffix}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {data.min}
        {suffix} → {data.max}
        {suffix}
      </p>
    </div>
  );
}

function GuideCard({ title, items, icon, note }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          {icon}
        </div>

        <h3 className="text-xl font-bold">
          {title}
        </h3>
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2"
          >
            <span className="font-bold text-emerald-600">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {note && (
        <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          {note}
        </p>
      )}
    </div>
  );
}