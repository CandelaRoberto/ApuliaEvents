import mongoose from "mongoose";

const PostSchema= new mongoose.Schema({
    titolo: { type: String, required: true },
    descrizione: { type: String, required: true },
    locandina: { type: String, required: true },
    dataEvento: { type: Date, required: true },
    oraEvento: { type: String, required: true },
    prezzo: { type: Number, required: true },
    bigliettiTotali: { type: Number, required: true },
    bigliettiDisponibili: { type: Number, required: true },
    organizzatore: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        address: { type: String, required: true },   
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    partecipanti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

const Post= mongoose.model('Post', PostSchema);
export default Post;



