import mongoose from "mongoose";

const MsgSchema=new mongoose.Schema({
    IdMittente:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    IdRicevente:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    Messaggio:{type:String, required:true},
    Letto:{type:Boolean, default:false},
},
 {timestamps: true}
);

const Messaggi=mongoose.model('Messaggi', MsgSchema);
export default Messaggi;

