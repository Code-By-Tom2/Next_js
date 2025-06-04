import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth';

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {status: 401}
        ) 
    }

    const userId = user?._id
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await userModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new:true}
        )
        if(!updateUser){
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accpet messages"
                },
                {status: 401}
            ) 
        }
        return Response.json(
            {
                success: false,
                message: "message acceptance status updated",
                updateUser
            },
            {status: 200}
        ) 
    } catch (error) {
        console.log("failed to update user status to accpet messages");
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accpet messages"
            },
            {status: 404}
        ) 
    }

}

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {status: 401}
        ) 
    }

    const userId = user?._id;

    try {
        const foundUser = await userModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 404}
            ) 
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {status: 200}
        )
    } catch (error) {
        console.log("failed to get message acceptance status");
        return Response.json(
            {
                success: false,
                message: "failed to get message acceptance status"
            },
            {status: 500}
        )
    }
}