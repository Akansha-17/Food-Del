import mongoose from "mongoose";

//Schema for food-Model
const foodSchema = new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    price: {type:Number,required:true},
    image: {type:String,required:true},
    category:{type:String,required:true}
})

//works like ternary opertor
const foodModel =mongoose.models.food || mongoose.model("food",foodSchema)

export default foodModel;