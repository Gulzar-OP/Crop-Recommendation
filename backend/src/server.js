// import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config();
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 8000;
console.log(port)
try {
  await connectDatabase();
  app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
