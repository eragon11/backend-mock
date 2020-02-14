import path from 'path';

let phaseOneconfig = {
  mongo: {
    database_name: "vesiot",
    host: "18.189.163.141",
    port: "27017",
    username: "",
    password: ""
  },
  logs: {
    path: path.join(__dirname, '../logs/info'),
    file_name: 'verizon.logs'
  },
  error_log: {
    path: path.join(__dirname, '../logs/exception'),
    file_name: 'verizon_error.logs'
  },
  emailService: {
    service: 'gmail',
    auth: {
      user: 'noreplysiqsess@gmail.com',
      pass: 'SiqSess@123#'
    }
  },
  email: {
    email_id: "admin@siqsess.com"
  }
};

export default phaseOneconfig;
