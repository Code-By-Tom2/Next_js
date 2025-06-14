import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {z} from "zod"
import { UsernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: UsernameValidation
})

export async function GET(request: Request){

    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters',
            }, {status: 400})
        }

        const {username} = result.data

        const existingVerifiedUser = await userModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message:'Username already exist',
            }, {status: 400})
        }
        return Response.json({
            success: true,
            message:'Username unique',
        }, {status: 400})

    } catch (error) {
        console.log("Error in username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}

        )
        
    }
}