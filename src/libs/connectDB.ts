// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import mongoose from "mongoose"
    // IMPORTING MIDDLEWARE
import eventLogger from "./eventLogger"

// A FUNCTION TO CONNECT TO MONGODB DATABASE
export default async function connectDB(): Promise<void>{
    try{
        await mongoose.connect(process.env.MONGODB_URI!)
        
        eventLogger("Database connected successfully", "Connection Achieved", "databaseLogs.txt")
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
    }
}