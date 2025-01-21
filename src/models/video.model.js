import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    video: { type: String, required: true }, //url from cloudinary
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true }, //url from cloudinary
    duration: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    views: { type: Number, default: 0 },
    isPublic: { type: Boolean, required: true },
    // favorites: { type: Number, default: 0 },
    // shares: { type: Number, default: 0 },
    //   subscribes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    //   dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // likes: { type: Number, default: 0 },
    // dislikes: { type: Number, default: 0 },

    //   comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timestamps: true,
  }
);
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
