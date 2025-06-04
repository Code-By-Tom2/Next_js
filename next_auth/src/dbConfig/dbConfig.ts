import mongoose from "mongoose";

export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('MongoDb connection successful');
        })
        connection.on('error', (err) => {
            console.log('MongoDb connection error: ', + err);
            process.exit();
        })
    } catch(error){
        console.log("DB connection error");
        console.log(error);    
    }
}