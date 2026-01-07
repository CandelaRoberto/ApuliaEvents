import jwt from 'jsonwebtoken';
import User from '../Modelli/Users_models.js';

const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:'Non autorizzato, token mancante'});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:'Token non valido'});
        }

        const user=await User.findById(decoded.UserId).select('-password');
        if(!user){
            return res.status(401).json({message:'Utente non trovato'});
        }
        req.user=user;
        next();
    } catch (error) {
        console.error('Errore nella protezione della rotta:', error);
        res.status(401).json({message:'Errore di autenticazione'});
    }
};

export default protectRoute;