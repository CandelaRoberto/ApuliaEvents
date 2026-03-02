import mongoose from "mongoose";

const NotificaSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref:"User", required:true },
  type: { type:String, enum:["message","event"], required:true },
  fromUser: { type: Schema.Types.ObjectId, ref:"User" },
  event: { type: Schema.Types.ObjectId, ref:"Post" },
  count: { type:Number, default:1 },
  seen: { type:Boolean, default:false },
},
  { timestamps: true }
);

export default mongoose.model("Notifiche", NotificaSchema);


