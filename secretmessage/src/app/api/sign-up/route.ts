import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";

export async function POST(request: Request){
    await dbConnect()
    try {
        const{username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: 'Username taken'
            }, {status: 400})
        }
        const existingUserByEmail = await userModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() + 900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'User already exist by this email'
                }, {status: 400})
            }else{
                const hashesdpassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashesdpassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() +3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashesdpassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new userModel({
                username,
                email,
                password: hashesdpassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: 'User registration successful. Verify email'
        }, {status: 201})
    } catch (error) {
        console.log('error while registering user',error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
} 