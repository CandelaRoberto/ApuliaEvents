import mongoose from "mongoose";
const connectDB= async()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log('Connesso al Database');
    }catch(error){
        console.error('Errore di connessione al Database');
        process.exit(1);
    }
}
export default connectDB;