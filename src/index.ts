import "dotenv/config"
import app from './app'
import { connectToDB } from "./config/database";

const PORT = process.env.PORT || 8000;


const startApp = async () => {
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`Server Running on http://localhost:${PORT}`)
    });
};
startApp();
