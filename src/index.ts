import "dotenv/config"
import app from './app'
import { connectToDB } from "./config/database";

const PORT = process.env.PORT || 8000;


const startApp = async () => {
    app.listen(PORT, async () => {
        await connectToDB();
        console.log(`Server Running on http://localhost:${PORT}`)
    });
};
startApp();
