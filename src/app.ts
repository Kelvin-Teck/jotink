import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import {
  errorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException,
} from "./middlewares/error-handler.middleware";
import authRoutes from "./routes/auth.route";
import noteRoutes from "./routes/note.route"

const app = express();

// Set up global error handlers first
handleUnhandledRejection();
handleUncaughtException();

// Request ID middleware
app.use((req: any, res, next) => {
  req.id = uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
});

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    const allowedOrigins = ["*"];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "User-Agent",
    "Keep-Alive",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 1728000, // 20 days
};

// Security and parsing middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: (req: { ip: any; }, res: any) => {
    console.log(`Rate limit hit for IP: ${req.ip}`);
    return "Too many requests — calm down!";
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: options.message,
      rateLimitResetTime: new Date(Date.now() + options.windowMs).toISOString(),
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/health-status", (req: Request, res: Response) => {
  // res.status(200).send('Server is Up and Running!!!')
  res.json({
    success: true,
    message: "Server is Healthy and Running!!!",
    timestamp: new Date().toISOString(),
  });
  return;
});

app.use("/api/auth", authRoutes);
app.use('/api/note', noteRoutes)

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
