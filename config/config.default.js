import nconf from "nconf";
import phaseOneConfig from "./phaseOneConfig";

let host = phaseOneConfig.mongo.host;
let port = phaseOneConfig.mongo.port;
let username = '';
let password = '';
let database_name = phaseOneConfig.mongo.database_name;

let mongodburl = `mongodb://${host}:${port}/${database_name}`

let config = nconf
  .argv()
  .env()
  .file({ file: "./config/config.custom.json" })
  .defaults({
    serverHost: "https://ec2-18-189-55-41.us-east-2.compute.amazonaws.com:9000/",
    clientHost: "http://localhost:3000",
    mongoUrl: mongodburl,
    // mongoUrl: "mongodb://localhost:27017/VerizonIOT",
    iotUrl: "https://5d0e223a022e19000b7fe51f.onlosant.com",
  })
  .get();

export default config;