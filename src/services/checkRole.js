import env from "../config/env.js";

function checkRoles(req, res, next) {
  if (res.locals.role == env.USER) {
    return res.sendStatus(401);
  } else {
    next();
  }
}


export default checkRoles;