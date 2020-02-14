// import winston from "winston";
// import winstonDailyRotateFile from "winston-daily-rotate-file";
// import path from "path";

// const datePattern = `.yyyy-MM-dd`;
// const errorLogTransport = new winstonDailyRotateFile({
//   level: "error",
//   datePattern,
//   filename: path.join(__dirname, "../winstonLogs/errorLogs/log"),
//   maxFiles: "30d"
// });
// const infoLogTransport = new winstonDailyRotateFile({
//   level: "info",
//   datePattern,
//   filename: path.join(__dirname, "../winstonLogs/infoLogs/log"),
//   maxFiles: "30d"
// });
// const LoggerJSON = {
//   error: new winston.Logger({ transports: [errorLogTransport] }),
//   info: new winston.Logger({ transports: [infoLogTransport] })
// };
// export const Logger = {
//   error: (msg, ...other) => {
//     LoggerJSON.error.log("error", msg, ...other);
//     LoggerJSON.info.log("info", msg, ...other);
//   },
//   info: (msg, ...other) => {
//     LoggerJSON.info.log("info", msg, ...other);
//   },
//   stream: {
//     write: (msg, ...other) => {
//       Logger.info(msg);
//     }
//   }
// };
