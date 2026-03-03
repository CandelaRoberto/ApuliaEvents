import mongoose from "mongoose";

const NotificaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  type: { type:String, enum:["message","event"], required:true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref:"Post" },
  count: { type:Number, default:1 },
  seen: { type:Boolean, default:false },
},
  { timestamps: true }
);

export default mongoose.model("Notifiche", NotificaSchema);



