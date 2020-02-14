#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "../app";
import http from "http";
import cluster from "cluster";
import { Logger } from "../helpers/winstonLogger";


let server = null;

// if (cluster.isMaster) {
//   let numWorkers = require("os").cpus().length;
//   Logger.info("Master cluster setting up " + numWorkers + " workers...");
//   for (let i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }
//   cluster.on("online", (worker) => {
//     Logger.info("Worker " + worker.process.pid + " is online");
//   });
//   cluster.on("exit", (worker, code, signal) => {
//     Logger.info(
//       "Worker " +
//         worker.process.pid +
//         " died with code: " +
//         code +
//         ", and signal: " +
//         signal
//     );
//     Logger.info("Starting a new worker");
//     setTimeout(() => {
//       cluster.fork();
//     }, 5000);
//   });
  
// } else {
  /**
   * Get port from environment and store in Express.
   */
  const port = normalizePort(process.env.PORT || "9000");
  app.set("port", port);

  /**
   * Create HTTP server.
   */
  server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
// }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      //Logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
     // Logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server ? server.address() : {};
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server started listening on port: " + port);
 // Logger.info("Listening on " + bind);
}
