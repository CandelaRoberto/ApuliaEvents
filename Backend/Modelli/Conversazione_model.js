import mongoose from "mongoose";

const ConvSchema=new mongoose.Schema({
    membri:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    messaggi:[{type:mongoose.Schema.Types.ObjectId, ref:'Messaggi', default:[]}],
},
    {timestamps: true}
);

const Conversazione=mongoose.model('Conversazione',ConvSchema);
export default Conversazione;