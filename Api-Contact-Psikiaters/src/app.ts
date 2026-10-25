import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import googleMapsRoutes from "./routes/googleMapsRoutes";
import logger from "./utils/logger";

// Memuat environment variables
dotenv.config();

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Middleware untuk keamanan
    this.app.use(helmet());

    // Middleware CORS
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes() {
    // Rute utama
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        message: "Psychiatrist API is running",
        version: "1.0.0",
      });
    });

    // Rute psychiatrist
    this.app.use("/api", googleMapsRoutes);
  }

  private initializeErrorHandling() {
    // Middleware untuk menangani rute tidak ditemukan
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        message: "Route not found",
        path: req.path,
      });
    });

    // Global error handler
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.stack);
        res.status(500).json({
          message: "Internal Server Error",
          error: process.env.NODE_ENV === "production" ? {} : err.message,
        });
      }
    );
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`Server running on port ${this.port}`);
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
