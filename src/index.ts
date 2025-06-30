import "dotenv/config";
import app from "./app";
import { connectToDB } from "./config/database.config";
import { gracefulShutdown } from "./middlewares/error-handler.middleware";

const PORT = process.env.PORT || 8000;

const startApp = async () => {
  await connectToDB();
  const server = app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
  });

  gracefulShutdown(server);
};

startApp();
