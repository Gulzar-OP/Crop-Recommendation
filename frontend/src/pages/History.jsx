
import { useEffect, useState } from "react";
import { LoaderCircle, Search, Trash2 } from "lucide-react";
import PageHead from "../components/PageHead";
import { deleteHistory, getHistory } from "../api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHistory();

      setItems(data.items || []);
    } catch (error) {
      setError(error.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const confirmed = window.confirm(
      "Delete this recommendation?"
    );

    if (!confirmed) return;

    try {
      await deleteHistory(id);

      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete history error:", error);

      alert(
        error.message || "Failed to delete recommendation"
      );
    }
  };

  const filtered = items.filter((item) =>
    `${item.field_name || ""} ${item.recommended_crop || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      <PageHead
        eyebrow="RECOMMENDATION RECORDS"
        title="Analysis history"
        subtitle="MongoDB mein saved tumhari personal recommendations."
      />

      <div className="card table-card">
        <div className="toolbar">
          <div>
            <Search />

            <input
              placeholder="Search field or crop..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="history-state">
            <LoaderCircle className="spin" />
            Loading history...
          </div>
        ) : error ? (
          <div className="history-state error">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="history-state">
            No recommendations found.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Crop</th>
                  <th>Confidence</th>
                  <th>Soil pH</th>
                  <th>Date</th>
                  <th>Model</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.field_name || "Unnamed field"}
                    </td>

                    <td className="capitalize">
                      {item.recommended_crop}
                    </td>

                    <td>
                      <strong>
                        {item.confidence}%
                      </strong>
                    </td>

                    <td>
                      {item.inputs?.ph ?? "N/A"}
                    </td>

                    <td>
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <span className="pill">
                        {item.model || "N/A"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="icon-btn"
                        onClick={() =>
                          remove(item.id)
                        }
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
