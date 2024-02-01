import { Router } from "express";
import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import env from "../config/env.js";
import auth from "../services/authentication.js";
import checkRole from "../services/checkRole.js";
import catchAsync from "../services/trycatch.js";
const router = Router();

router.post(
  "/signup",
  catchAsync(async (req, res) => {
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
  })
);

router.post(
  "/login",
  catchAsync(async (req, res) => {
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
  })
);

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL,
    pass: "jsho zjpc boqx uduh",
  },
});

router.post(
  "/forgotpassword",
  catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Password sent successfully to your emai." });
    }

    let mailOptions = {
      from: env.EMAIL,
      to: email,
      subject: `Password by Cafe Management System`,
      html: `<p><b>Your Login details for Cafe Management SYSTEM</b><br><b>Email: </b>${user.email}<br><b>Password: </b>${user.password}<br><a href="http://localhost:4200/">Click here to login</a></p>`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res
      .status(200)
      .json({ message: "Password sent successfully to your emai." });
  })
);

router.get(
  "/get",
  auth,
  checkRole,
  catchAsync(async (req, res) => {
    const users = await UserModel.find({ role: "user" }).select("-password");
    return res.status(200).json({ results: users });
  })
);

router.patch(
  "/update",
  auth,
  checkRole,
  catchAsync(async (req, res) => {
    const { status, id } = req.body;
    if (id) {
      const user = await UserModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({ message: "User dos not exists" });
      }

      await UserModel.updateOne(
        { _id: id },
        {
          status,
        }
      );

      return res.status(200).json({ message: "User updated Successfully" });
    }

    return res.status(401).json({ message: "Invalid Credintials" });
  })
);

router.get(
  "/check-token",
  auth,
  catchAsync(async (req, res) => {
    return res.status(200).json({ message: true });
  })
);

router.post(
  "/change-password",
  auth,
  catchAsync(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.locals;
    const user = await UserModel.findOne({
      $and: [{ email }, { password: oldPassword }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Old password is wrong" });
    }

    await UserModel.updateOne(
      { email },
      {
        password: newPassword,
      }
    );
    return res.status(200).json({ message: "Password changed successfully" });
  })
);

export default router;
