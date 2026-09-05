import { BarChart3, Leaf, TrendingUp } from "lucide-react";
import PageHead from "../components/PageHead";
const bars = [38, 52, 46, 68, 61, 78, 70, 88, 83, 95, 86, 91],
  crops = [
    ["Rice", 92],
    ["Jute", 76],
    ["Maize", 64],
    ["Mung Bean", 51],
    ["Banana", 38],
  ];
export default function Insights() {
  return (
    <>
      <PageHead
        eyebrow="FARM INTELLIGENCE"
        title="Insights & trends"
        subtitle="Understand crop suitability and model performance."
      />
      <div className="stats">
        <Mini
          icon={<TrendingUp />}
          value="+12.4%"
          text="Suitability improvement"
        />
        <Mini icon={<Leaf />} value="Rice" text="Most recommended" />
        <Mini icon={<BarChart3 />} value="91.2%" text="Model confidence" />
      </div>
      <div className="insight-grid">
        <div className="card panel">
          <h2>Recommendation activity</h2>
          <p>Monthly analyses</p>
          <div className="chart">
            {bars.map((v, i) => (
              <i key={i} style={{ height: `${v}%` }} />
            ))}
          </div>
        </div>
        <div className="card panel">
          <h2>Crop suitability</h2>
          <p>Average across active fields</p>
          <div className="crop-bars">
            {crops.map(([c, v]) => (
              <div key={c}>
                <span>
                  <b>{c}</b>
                  {v}%
                </span>
                <i>
                  <em style={{ width: `${v}%` }} />
                </i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
function Mini({ icon, value, text }) {
  return (
    <div className="card mini">
      <i>{icon}</i>
      <div>
        <h2>{value}</h2>
        <span>{text}</span>
      </div>
    </div>
  );
}
