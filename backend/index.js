import express from "express";
import cors from "cors";
import courseRoutes from "./src/routes/index.js";
import { handleMongoDbConnection } from "./src/config/index.js";
import "./src/workers/index.js";
await handleMongoDbConnection();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api", courseRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`server started at port ${PORT}`);
});
