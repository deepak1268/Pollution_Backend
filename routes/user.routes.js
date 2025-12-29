const express = require("express");
const Router = express.Router;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { z } = require("zod");
const { userModel } = require("../db");

const userRouter = Router();

userRouter.post("/signup",async (req,res) => {
    // add input validation logic

    const {username,email,firstName,lastName,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        await userModel.create({
            username,
            email,
            firstName,
            lastName,
            password : hashedPassword
        })
        return res.status(200).json({
            message : "Sign Up Successful"
        })
    } catch (err){
        console.error(err);
        if(err.code==11000){
            const field = Object.keys(err.keyValue)[0];
            return res.json({
                message: `This ${field} already exists.`
            })
        }
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

userRouter.post("/signin",async (req,res) => {
    // input validation 

    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({
            email
        });
        if(!user) {
            return res.status(409).json({
                message: "This user does not exist."
            })
        } 
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            const token = jwt.sign({
                userId: user._id
            },process.env.JWT_SECRET_KEY)
            return res.status(200).json({
                message : "Sign In Successful",
                token
            })
        } else {
            return res.status(409).json({
                message: "Invalid Credentials"
            })
        }       
    } catch (err){
        console.error(err);
        return res.json({
            message: "Internal Server Error"
        })
    }
})

module.exports = {
    userRouter
}