import jwt from "jsonwebtoken";
import key from "../config/store";
import role_masters from "../api/user_management/role/roleModel"
import * as _ from "lodash"

let tokenAuthorization = {};

tokenAuthorization.verify = async (req, res, next) => {
  console.log('verify')
  let tokenSignature = req.headers["authorization"];
  console.log(tokenSignature);

  if (tokenSignature != undefined) {
    let token = await (tokenAuthorization.verifyAndDecode(tokenSignature));
    console.log(token);

    req.userToken = token;
    console.log(req.userToken.data.locationDetails)
    if (token.valid) {
      // let user = await UserService.getUserByUserId(token.data.id);
      // let loggedInUser = user[0];
      // let fisId = await UserService.getUserBasedFisId(user[0].id);
      // let payload = UserController.getPayload(loggedInUser, fisId);
      let logInData = await tokenAuthorization.getUpdatedJwtToken(token, tokenSignature);

      req.userToken.token = logInData;

      res.setHeader('authorization', logInData.token);
      return next();
    } else {
      res.status(400).send({
        status: "error",
        code: 400,
        message: "Token Invalid"
      });
    }
  } else {
    res.status(401).send({
      status: "error",
      code: 401,
      message: "Authentication Failure"
    });
  }
};


tokenAuthorization.verifyPermission = function (allowedRoles) {
  return async (req, res, next) => {
    try {
      let tokenSignature = req.headers["authorization"];

      let token = await (tokenAuthorization.verifyAndDecode(tokenSignature));
      let role_id = token.data.role_name;
      let index = allowedRoles.indexOf(role_id);

      if (index != -1) {
        return next()
      } else {
        res.status({
          code: 403,
          msg: "Forbidden",
          data: []
        })
      }
    } catch (error) {
      console.log(error);
      res.status({
        code: 401,
        msg: "Authentication Failure",
        data: []
      })
    }
  }
}

tokenAuthorization.verifyAndDecode = (token) => {
  let decodedPayload = {};
  try {
    decodedPayload = jwt.verify(token, key.secret);
    if (decodedPayload.exp >= (Date.now() / 1000)) {
      decodedPayload.valid = true;
    } else {
      decodedPayload.valid = false;
    }
  } catch (error) {
    return decodedPayload.valid = false;
  }
  return decodedPayload;
};

tokenAuthorization.getUpdatedJwtToken = async (payload, token) => {
  let decodedPayload = jwt.verify(token, key.secret);
  payload.token = await jwt.sign({
    data: payload
  }, key.secret, {
    expiresIn: decodedPayload.exp
  });
  return payload;
};

export default tokenAuthorization;
// export default function authenticator (req, res, next)  {
//     const bearerHeader = req.headers["authorization"];
//     if (typeof bearerHeader !== "undefined") {
//       const bearer = bearerHeader.split(" ");
//       const bearerToken = bearer[1];
//       req.token = bearerToken;
//       jwt.verify(req.token, key.secret);
//       return next();
//     } else {
//       res.sendStatus(403);
//     }
//   }