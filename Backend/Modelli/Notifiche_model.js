import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NotificaSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref:"User", required:true },
  type: { type:String, enum:["message","event"], required:true },
  fromUser: { type: Schema.Types.ObjectId, ref:"User" },
  event: { type: Schema.Types.ObjectId, ref:"Post" },
  count: { type:Number, default:1 },
  seen: { type:Boolean, default:false },
  createdAt: { type:Date, default:Date.now }
});


export default mongoose.model("Notifiche", NotificaSchema);