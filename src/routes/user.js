import { Router } from "express";
import { UserModel } from "../models/user.js";
const route=Router()


route.post('/signup',async (req,res)=>{
    let user=req.body
    
})


export default route