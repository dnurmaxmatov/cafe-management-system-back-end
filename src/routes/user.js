import { Router } from "express";
import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import env from "../config/env.js";
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    let { name, email, status, role, password, contactNumber } = req.body;
    if (name && email && password && contactNumber) {
      let userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      UserModel.create(req.body);
      return res.status(201).json({ message: "Successfully Registred" });
    } else {
      return res.status(400).json({ message: "Invalid raw data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ messge: "Incorrect username or password" });
    } else if (user.status === false) {
      return res.status(401).json({ message: "Wait for Admin Approval" });
    } else if (user.password === password) {
      const response = { email: user.email, role: user.role };
      const accessToken = jwt.sign(response, env.SECRET, { expiresIn: "8h" });
      res.status(200).json({ token: accessToken });
    } else {
      return res.json({
        message: "Something went wrong. Please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL,
    pass: "jsho zjpc boqx uduh",
  },
});




router.post('/forgotpassword', async (req,res)=>{
    try {
        const {email}=req.body
        const user=await UserModel.findOne({email}) 
        if(!user){
            return res.status(200).json({message: 'Password sent successfully to your emai.'})
        }  

        let mailOptions = {
          from: env.EMAIL,
          to: email,
          subject: `Password by Cafe Management System`,
          html: `<p><b>Your Login details for Cafe Management SYSTEM</b><br><b>Email: </b>${user.email}<br><b>Password: </b>${user.password}<br><a href="http://localhost:4200/">Click here to login</a></p>`,
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }else{
                console.log('Email sent: '+info.response);
            }
        })
            return res
              .status(200)
              .json({ message: "Password sent successfully to your emai." });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    };
})

export default router;
