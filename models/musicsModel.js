import mongoose, { Schema } from "mongoose";

const musicSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    singers: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    startTime:{
        type:Number
    },
    endTime:{
        type:Number
    }
  },
  {
    timestamps: true,
  }
);

export const Music = mongoose.model("Music", musicSchema);
