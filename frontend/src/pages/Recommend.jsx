import { useState } from "react";
import {
  Droplets,
  FlaskConical,
  Leaf,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import PageHead from "../components/PageHead";
import { recommendCrop } from "../api";
import { useNavigate } from "react-router-dom";
const initial = {
  field_name: "North Field",
  N: 90,
  P: 42,
  K: 43,
  temperature: 20.87,
  humidity: 82,
  ph: 6.5,
  rainfall: 202.93,
};
const fields = [
  ["N", "Nitrogen (N)", "mg/kg", 0, 200],
  ["P", "Phosphorus (P)", "mg/kg", 0, 200],
  ["K", "Potassium (K)", "mg/kg", 0, 250],
  ["temperature", "Temperature", "°C", -10, 60],
  ["humidity", "Humidity", "%", 0, 100],
  ["ph", "Soil pH", "pH", 0, 14],
  ["rainfall", "Rainfall", "mm", 0, 1000],
];

export default function Recommend() {
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCropClick = (crop) => {
    console.log("Clicked crop:", crop);

    if (!crop) {
      console.log("Crop not found");
      return;
    }

    navigate(`/crop/${encodeURIComponent(crop)}`);
  };
  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await recommendCrop(values);

      console.log("API RESPONSE:", response);

      setResult(response);
    } catch (err) {
      console.error(err);

      setError(
        err.message === "Failed to fetch"
          ? "Node backend port 8000 par connect nahi hua."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHead
        eyebrow="RECOMMENDATION ENGINE"
        title="Find the right crop for your soil"
        subtitle="Node validates input, Python ANN predicts, MongoDB saves the result."
      />
      <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <form
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={submit}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-farm-100 text-farm-700">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">Soil & climate parameters</h2>
              <p className="text-sm text-slate-500">
                Use latest laboratory values
              </p>
            </div>
            <button
              className="ml-auto flex items-center gap-2 text-sm font-bold text-farm-700"
              type="button"
              onClick={() => {
                setValues(initial);
                setResult(null);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          <label className="mt-6 block text-sm font-semibold">
            Field name
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-farm-500"
              value={values.field_name}
              onChange={(e) =>
                setValues({ ...values, field_name: e.target.value })
              }
              maxLength="100"
            />
          </label>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {fields.map(([name, label, unit, min, max]) => (
              <label className="text-sm font-semibold" key={name}>
                {label}
                <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-farm-500">
                  <input
                    className="w-full bg-transparent px-4 py-3 outline-none"
                    type="number"
                    step="any"
                    min={min}
                    max={max}
                    value={values[name]}
                    onChange={(e) =>
                      setValues({ ...values, [name]: Number(e.target.value) })
                    }
                    required
                  />
                  <span className="self-center pr-3 text-xs text-slate-400">
                    {unit}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-farm-900 font-bold text-white hover:bg-farm-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Leaf className="h-5 w-5" />
                Recommend & save
              </>
            )}
          </button>
        </form>
        <section>
          {result ? (
            <div
              onClick={() => handleCropClick(result.recommended_crop)}
              className="cursor-pointer rounded-3xl border-2 border-emerald-400 bg-farm-900 p-7 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <p className="text-xs font-bold tracking-widest text-emerald-200">
                TOP RECOMMENDATION
              </p>

              <div className="mt-7 flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-bold capitalize">
                    {result.recommended_crop}
                  </h2>

                  <p className="mt-2 text-sm text-emerald-200">
                    Click to view complete {result.recommended_crop} cultivation
                    guide →
                  </p>

                  <span className="mt-2 block text-xs text-white/60">
                    Saved to MongoDB history
                  </span>
                </div>

                <div className="grid h-24 w-24 place-items-center rounded-full border-8 border-emerald-400 text-center">
                  <b>{result.confidence}%</b>
                </div>
              </div>

              <div
                className="mt-7 rounded-2xl bg-white/10 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-2 text-sm font-bold">Alternative crops</h3>

                {result.alternatives?.map((item) => (
                  <div
                    className="flex justify-between py-2 text-sm capitalize"
                    key={item.crop}
                  >
                    <span>{item.crop}</span>
                    <b>{item.confidence}%</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <div>
                <Leaf className="mx-auto h-10 w-10 text-farm-500" />
                <h2 className="mt-4 font-bold">Prediction appears here</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fill the parameters and run recommendation.
                </p>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-3 rounded-2xl border border-farm-100 bg-farm-50 p-4 text-sm text-farm-900">
            <Droplets className="h-5 w-5 shrink-0" />
            <p>
              <b>Tip:</b> Laboratory soil-test values improve result quality.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
