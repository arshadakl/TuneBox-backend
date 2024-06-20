import mongoose, { Schema } from "mongoose";

const MusicScheema = new Schema({
    title:{
        type:String,
        require:true
    },
    singers:{
        type:String,
    },
    duration:{
        type:Number,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    language:{
        type:String
    }
})


export const Music = mongoose.model("music",MusicScheema)