import App from "./app";
import logger from "./utils/logger";

// Inisialisasi dan jalankan server
const server = new App();

// Tangani uncaught exceptions dan unhandled rejections
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...");
  logger.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("UNHANDLED REJECTION! Shutting down...");
  logger.error(`Reason: ${reason}`);
  logger.error(`Promise: ${promise}`);
  process.exit(1);
});

server.listen();
