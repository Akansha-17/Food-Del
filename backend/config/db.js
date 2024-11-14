import mongoose from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://akansha:17082001@cluster0.sav7u.mongodb.net/FOOD-DEL').then(()=>console.log("DB connected")); 
}