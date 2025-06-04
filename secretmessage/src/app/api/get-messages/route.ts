import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await userModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$message'},
            {$sort: {'message.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$message'}}}
        ])

        if (!user || user.length === 0) {
            return Response.json(
            { 
                message: 'User not found',
                success: false 
            },
              { status: 404 }
            );
          }
      
          return Response.json(
            { 
                success: true,
                messages: user[0].messages },
            {
              status: 200,
            }
          );
    } catch (error) {
        console.error('An error occurred: ', error);
    return Response.json(
        { 
            message: 'Internal server error',
            success: false 
        },
      { status: 500 }
    );
    }
}