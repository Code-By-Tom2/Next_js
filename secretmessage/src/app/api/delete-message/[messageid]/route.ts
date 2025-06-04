import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}){
    const messageId = params.messageid
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
    try {
        const updateResult = await userModel.updateOne(
            {_id: user._id},
            {$pull: {message: {_id: messageId}}}
        )
        if(updateResult.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "message not found or deleted already"
                },
                {status: 404}
            ) 
        }
        return Response.json(
            {
                success: true,
                message: "message deleted successfully"
            },
            {status: 200}
        ) 
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error while deleting message"
            },
            {status: 500}
        ) 
    }

}