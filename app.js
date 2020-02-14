import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import fs from 'fs';
import { union, isArray, isEmpty, castArray } from "lodash";
import morgan from 'morgan';
import axios from 'axios';
const socketIo = require("socket.io");

// Local imports 
import config from "./config/config.default";
import winston from "./config/logger";

// Routes Import
import User from "./api/hvac_masters/user/userRoutes";
import AHU_Masters from "./api/hvac_masters/ahu/ahuRoutes";
import Location from "./api/hvac_masters/location/locationRoutes";
import Site from "./api/hvac_masters/site/siteRoutes";
import Building from "./api/hvac_masters/building/buildingRoutes";
import Zone from "./api/hvac_masters/zone/zoneRoutes";
import Compressor_Masters from "./api/hvac_masters/compressor/compressorRoutes";
import SolenoidValve_Masters from "./api/hvac_masters/solenoidValve/solenoidValveRoutes";
import Sensor from "./api/hvac_masters/sensor/sensorRoutes";
import IOModule from "./api/hvac_masters/iomodule/ioModuleRoutes";
import Fan_Masters from "./api/hvac_masters/fan/fanRoutes";
import waterTank_Masters from "./api/hvac_masters/waterTank/waterTankRoutes";
import ZoneTemprature_Masters from "./api/hvac_masters/zoneTemprature/zoneTempratureRoutes";
import DeviceSensor from "./api/hvac_masters/deviceSensor/deviceSensorRoutes";
import energyMeter_masters from "./api/hvac_masters/eneryMeter/energyMeterRoutes";
import Chiller_Masters from "./api/hvac_masters/chiller/chillerRoutes";
import Pump_Masters from "./api/hvac_masters/pump/pumpRoutes";
import MainModule_Masters from "./api/hvac_masters/mainModule/mainModuleRoutes";
import SubModule_Masters from "./api/hvac_masters/subModule/subModuleRoutes";
import HvacPanel_Masters from "./api/hvac_masters/hvacPanel/hvacPanelRoutes";
import Gateway_Masters from "./api/gateway_masters/gateway/gatewayRoutes";
import AHU_Transaction from "./api/hvac_transaction/ahu/ahuRoutes";
import Chiller_Transaction from "./api/hvac_transaction/chiller/chillerRoutes";
import Compressor_Transaction from "./api/hvac_transaction/compressor/compressorRoutes";
import EnergyMeter_Transaction from "./api/hvac_transaction/energyMeter/energyMeterRoutes";
import Fan_Transaction from "./api/hvac_transaction/fan/fanRoutes";
import Pump_Transaction from "./api/hvac_transaction/pump/pumpRoutes";
import solenoidValve_Transaction from "./api/hvac_transaction/solenoidValve/solenoidValveRoutes";
import waterTank_Transaction from "./api/hvac_transaction/waterTank/waterTankRouters";
import zoneTemprature_Transaction from "./api/hvac_transaction/zoneTemprature/zoneTempratureRoutes";
import ahu_relay_transaction from "./api/hvac_relay_transaction/ahu/ahuRoutes";
import fan_relay_transaction from "./api/hvac_relay_transaction/fan/fanRoutes";
import compressor_relay_transaction from "./api/hvac_relay_transaction/compressor/compressorRoutes";
import chiller_relay_transaction from "./api/hvac_relay_transaction/chiller/chillerRoutes";
import pump_relay_transaction from "./api/hvac_relay_transaction/pump/pumpRoutes";
import autoIssues from "./api/user_management/AutoIssues/autoIssuesRoutes";
import entitlementDetails from "./api/user_management/EntitlementDetails/entitlementDetailsRoutes";
import entitlementHeader from "./api/user_management/EntitlementHeader/entitlementHeaderRoutes";
import deviceZoneMap from "./api/hvac_masters/deviceZoneMap/deviceZonemapRoutes";
import panel from "./api/energy_masters/panel/panelRoutes";
import circuitBreaker from './api/energy_masters/circuitBreaker/circuitBreakerRoutes';
import equipment from './api/energy_masters/equipment/equipmentRoutes';
import HVAC_Utility from './api/hvac_utility/hvacUtilityRoutes';
import refrigeration from './api/refrigeration_masters/refrigeration/refrigerationRoutes';
import ref_Temprature_Masters from './api/refrigeration_masters/temprature/tempratureRoutes';
import waterDetector_Masters from './api/refrigeration_masters/waterDetector/waterDetectorRoutes';
import doorStatus_Masters from './api/refrigeration_masters/doorStatus/doorStatusRoutes';
import lightIntensity_Masters from './api/refrigeration_masters/lightIntensity/lightIntensityRoutes';
import energyMeterUnit_masters from './api/hvac_masters/energyMeterUnit/energyMeterUnitRoutes';
import doorStatus_Transaction from './api/refrigeration_transaction/doorStatus/doorStatusRoutes';
import temperature_Transaction from './api/refrigeration_transaction/temprature/tempratureRoutes';
import waterDetector_Transaction from './api/refrigeration_transaction/waterDetector/waterDetectorRoutes';
import LightIntensity_Transaction from './api/refrigeration_transaction/lightIntensity/lightIntensityRoutes';
import solenoid_Valve_transaction from "./api/hvac_relay_transaction/solenoidValve/solenoidValveRoutes";

import Test from "./api/hvac_masters/test/testRoutes";
import UserManagement from './api/user_management/role/roleRoutes'; ``

import zoneTempratureSocket from './api/socket/hvac_transaction/zoneTemperature/zoneTemperatureRoutes';
import ahuSocket from './api/socket/hvac_transaction/ahu/ahuRoutes';
import trendingAnalyticsSocket from './api/socket/hvac_transaction/trendingAnalytics/trendingAnalyticsRoutes';
import liveStatus from './api/socket/hvac_transaction/liveStatus/liveStatusRoutes';
import compressorSocket from './api/socket/hvac_transaction/compressor/compressorRoutes';
import fanSocket from './api/socket/hvac_transaction/fan/fanRoutes';
import chillerSocket from './api/socket/hvac_transaction/chiller/chillerRoutes';
import pumpSocket from './api/socket/hvac_transaction/pump/pumpRoutes';
import waterTankSocket from './api/socket/hvac_transaction/waterTank/waterTankRoutes';
import solenoidValveSocket from './api/socket/hvac_transaction/solenoidValve/solenoidValveRoutes';
import sensorHealthSocket from './api/socket/hvac_transaction/sensorHealth/sensorHealthRoutes';
import issueTrendingSocket from "./api/socket/hvac_transaction/issueTrending/issueTrendingRoutes";
import energyMonitor from "./api/socket/hvac_transaction/energyMonitor/energyMonitorRoutes";
import refrigerationSocket from "./api/socket/hvac_transaction/refrigeration/refrigerationRoutes";
// import View from './api/optimization/view/viewRoutes';

import socketService from './socket.service';
import nodeServer from './api/node_servers/nodeServerRoutes';
import AutoUpdate from './api/socket/auto_update';
import cronSection from './api/socket/cron/cronRoutes';
import cronController from './api/socket/cron/cronController';

import tokenAuth from './middelwares/tokenAuth';

//validation
import validatior from './api/validators/validateRoutes'

import http from 'http';
import https from 'https';

// Declaration
let { mongoUrl, clientHost, allowedOrigins } = config;

// Express Setup 
const app = express();

// const server = https.createServer({
//   cert: fs.readFileSync('cert/ec2-18-189-55-41.us-east-2.compute.amazonaws.com.cer'),
//   key: fs.readFileSync('cert/ec2-18-189-55-41.us-east-2.compute.amazonaws.com.pem'),
//   passphrase: 'test'
// }, app);

const server = http.createServer(app);

const autoUpdate = new AutoUpdate(server);
autoUpdate.intialize();

// Middlewares
let corsAllowedOrigins = castArray(clientHost);
if (allowedOrigins && isArray(allowedOrigins) && !isEmpty(allowedOrigins)) {
  corsAllowedOrigins = union(corsAllowedOrigins, allowedOrigins);
}

// app.use(cors({
//   allowedOrigins: corsAllowedOrigins,
//   credentials: true
// })
// );

app.use(cors());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());

// app.use(morgan('combined', { stream: winston.stream }));

// MongoDB config
mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : mongoUrl;
// let _db;
mongoose.connect(mongoUrl, { poolSize: 20, useNewUrlParser: true }, function (err, client) {
  // _db = client.db("iotmeetdb");
  console.log("Successfully connected to Database: " + mongoUrl);
});

mongoose.Promise = Promise;

mongoose.connection.on("error", (error) => {
  console.log("Mongoose connection error : ", JSON.stringify(error), () => {
    /* On mongo connection error, exit from running server */
    process.exit(0);
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected : ", new Date());
  // Logger.error("Mongoose connection disconnected : ", new Date());
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

app.get('/cron', [])

/** --------- winston setup Loggers------- */
// let winstonLogDirectory = path.join(__dirname, "winstonLogs");
// let errorLogDirectory = path.join(__dirname, "winstonLogs/errorLogs");
// let infoLogDirectory = path.join(__dirname, "winstonLogs/infoLogs");

// if (!fs.existsSync(winstonLogDirectory)) {
//   fs.mkdirSync(winstonLogDirectory, { recursive: true });
// }
// if (!fs.existsSync(errorLogDirectory)) {
//   fs.mkdirSync(errorLogDirectory, { recursive: true });
// }
// if (!fs.existsSync(infoLogDirectory)) {
//   fs.mkdirSync(infoLogDirectory, { recursive: true });
// }

const io = socketIo(server);

let interval1;
io.on("connection", async (socket) => {
  console.log("New client connected");
  if (interval1) {
    clearInterval(interval1);
  }

  // interval = setInterval(() => getApiAndEmit(socket), 10000);

  // interval1 = setInterval(async () => socket.emit('zone', await socketService.zone()), 5000);
  // let zonedata = await socketService.zone();
  // setTimeout(() => clearInterval(interval1), 60000)
  // let payload = {
  //   data: zonedata
  // }
  // console.log(payload);

  // Step 1: join to rooms

  // socket.join("zoneTemperature");

  // io.to("zoneTemperature").emit("zone");

  // socket.on('zonegraphIn', (data) => {
  //   console.log("zonegraphIn")
  //   console.log(data);
  //   setInterval(async () => socket.emit('zonegraphOut', await socketService.zoneGraph(data)), 10000);
  // })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/878dad2e6cf7a33b50ad55330cb61446/37.8267,-122.4233"
    ); // Getting the data from DarkSky
    console.log(res.data.currently.temperature);
    socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

// controller call
// app.use('/data_update_from_losant', function(req, res, next) {
// { }
//})
app.use("/user", User);
app.use("/location", Location);
app.use("/site", Site);
app.use("/building", Building);
app.use("/zone", Zone);
app.use('/deviceSensor', DeviceSensor);
app.use('/sensor', Sensor);
app.use('/iomodule', IOModule);
app.use("/hvac_masters/ahu", AHU_Masters);
app.use("/hvac_masters/compressor", Compressor_Masters);
app.use('/hvac_masters/fan', Fan_Masters);
app.use('/hvac_masters/waterTank', waterTank_Masters);
app.use('/hvac_masters/zoneTemprature', ZoneTemprature_Masters);
app.use('/hvac_masters/SolenoidValve', SolenoidValve_Masters);
app.use('/hvac_masters/deviceZoneMap', deviceZoneMap);
app.use('/hvac_masters/energyMeter', energyMeter_masters);
app.use('/hvac_masters/chiller', Chiller_Masters);
app.use('/hvac_masters/pump', Pump_Masters);
app.use('/hvac_masters/mainModule', MainModule_Masters);
app.use('/hvac_masters/subModule', SubModule_Masters);
app.use('/hvac_masters/hvacPanel', HvacPanel_Masters);
app.use('/gateway_masters/gateway', Gateway_Masters);
app.use('/hvac_masters/energyMeterUnit', energyMeterUnit_masters);
app.use('/hvac_transactions/ahu', AHU_Transaction);
app.use('/hvac_transactions/chiller', Chiller_Transaction);
app.use('/hvac_transactions/compressor', Compressor_Transaction);
app.use('/hvac_transactions/energyMeter', EnergyMeter_Transaction);
app.use('/hvac_transactions/fan', Fan_Transaction);
app.use('/hvac_transactions/pump', Pump_Transaction);
app.use('/hvac_transactions/solenoidValve', solenoidValve_Transaction);
app.use('/hvac_transactions/waterTank', waterTank_Transaction);
app.use('/hvac_transactions/zoneTemprature', zoneTemprature_Transaction);
app.use('/hvac_relay_transactions/ahu', ahu_relay_transaction);
app.use('/hvac_relay_transactions/fan', fan_relay_transaction);
app.use('/hvac_relay_transactions/pump', pump_relay_transaction);
app.use('/hvac_relay_transactions/compressor', compressor_relay_transaction);
app.use('/hvac_relay_transactions/chiller', chiller_relay_transaction);
app.use('/hvac_relay_transactions/solenoidValve', solenoid_Valve_transaction);
app.use('/user_management/autoIssues', autoIssues);
app.use('/user_management/entitlementDetails', entitlementDetails);
app.use('/user_management/entitlementHeader', entitlementHeader);
app.use('/energy_masters/panel', panel);
app.use('/energy_masters/circuitBreaker', circuitBreaker);
app.use('/energy_masters/equipment', equipment);
app.use('/hvac_utility', HVAC_Utility);
app.use('/refrigeration_masters/refrigeration', refrigeration);
app.use('/refrigeration_masters/temperature', ref_Temprature_Masters);
app.use('/refrigeration_masters/waterDetector', waterDetector_Masters);
app.use('/refrigeration_masters/doorStatus', doorStatus_Masters);
app.use('/refrigeration_masters/lightIntensity', lightIntensity_Masters);
app.use('/refrigeration_transaction/doorStatus', doorStatus_Transaction);
app.use('/refrigeration_transaction/temperature', temperature_Transaction);
app.use('/refrigeration_transaction/waterDetector', waterDetector_Transaction);
app.use('/refrigeration_transaction/lightIntensity', LightIntensity_Transaction);

app.use('/socket/hvac_transactions/zoneTemperature', zoneTempratureSocket);
app.use('/socket/hvac_transactions/ahu', ahuSocket);
app.use('/socket/hvac_transactions/trendingAnalytics', trendingAnalyticsSocket);
app.use('/socket/hvac_transactions/liveStatus', liveStatus);
app.use('/socket/hvac_transactions/compressor', compressorSocket);
app.use('/socket/hvac_transactions/fan', fanSocket);
app.use('/socket/hvac_transactions/chiller', chillerSocket);
app.use('/socket/hvac_transactions/pump', pumpSocket);
app.use('/socket/hvac_transactions/waterTank', waterTankSocket);
app.use('/socket/hvac_transactions/solenoidValve', solenoidValveSocket);
app.use('/socket/hvac_transactions/sensorHealth', sensorHealthSocket);
app.use('/socket/hvac_transactions/issueTrending', issueTrendingSocket);
app.use('/socket/hvac_transactions/energyMonitor', energyMonitor);
app.use('/socket/hvac_transactions/refrigeration', refrigerationSocket);
app.use('/socket/cron', cronSection);
app.use('/validator', validatior);

//optimization
// app.use('/optimization/view', View);

app.use('/nodeserver', nodeServer);

//test
app.use("/test", Test);

app.use('/user_management/role', UserManagement);

// error handler
app.use(function (err, req, res, next) {
  winston.stream.error(err.stack);
})


// console.log(path.join(__dirname, "../Verizon_IOT_Server/winstonLogs"));
const port = normalizePort(process.env.PORT || "9000");
app.set("port", port);

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


server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onListening() {
  const addr = server ? server.address() : {};
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  // console.log("Server started listening on port: " + port);
  console.table([["server", "started"], ["port", port]]);
  // Logger.info("Listening on " + bind);
  cronController.testCron();
  // cronController.basedOnRoles();
}

export default app;