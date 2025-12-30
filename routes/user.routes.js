const express = require("express");
const Router = express.Router;
const { signupValidation } = require("../middlewares/validation");
const { login, signup } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.post("/signup",signupValidation,signup)
userRouter.post("/signin",login)

module.exports = {
    userRouter
}