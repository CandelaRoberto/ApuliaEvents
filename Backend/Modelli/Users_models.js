import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    nome:{type:String, required:true},
    cognome:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    ruolo:{type:String,
           enum:['Utente','Organizzatore'], 
           default:'Utente'},
})

const User= mongoose.model('User', UserSchema);
export default User;