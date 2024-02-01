import env from "../config/env.js";
import jwt from "jsonwebtoken";


function authinticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader&&authHeader.split(' ')[1]
    if(token==null) return res.sendStatus(401)

    jwt.verify(token, env.SECRET, (err, response)=>{
        if(err) return res.sendStatus(403)
        req.locals=response
         next()
    })
}


export default authinticateToken;