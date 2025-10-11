import mongoose from "mongoose";


export const  connectDB = async () =>{
    try {
          mongoose.connect(`${process.env.DB_Connection}`)
          console.log("Connected to Database Successfully!");
    } catch (error) {
           console.log("Couldn't connect to Database: ", error)
    }
  
}