import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { truncate } from "fs/promises";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()
        
        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({username: decodedUsername}) 
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 500}
            )    
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "account verification successful"
                },
                {status: 200}
            ) 
        } else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "verification code expired, signup again"
                },
                {status: 400}
            ) 
        }else{
            return Response.json(
                {
                    success: false,
                    message: "incorrect code"
                },
                {status: 200}
            ) 
        }
        
    } catch (error) {
        console.log("Error in verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error in verifying user"
            },
            {status: 500}

        )
    }
}