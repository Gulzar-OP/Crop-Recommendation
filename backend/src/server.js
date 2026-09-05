import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 8000;
try {
  await connectDatabase();
  app.listen(port, () => console.log(`Node API running at http://localhost:${port}`));
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
