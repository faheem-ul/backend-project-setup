import { Schema } from "mongoose";

const subscriptionModel = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  subscribedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionModel);
