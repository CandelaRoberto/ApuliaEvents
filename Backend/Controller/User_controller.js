import bcrypt from 'bcryptjs';
import User from '../Modelli/Users_models.js';
import gentToken from '../Utils/GenToken.js';
import { io } from "../Socket/Socket.js";

export const registrazione=async(req,res)=>{
try {
    const {nome, cognome, username, email, password, confermapassword, ruolo}=req.body;
    if (!nome || !cognome || !username || !email || !password || !confermapassword) {
         return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
    };
    if (username.length > 20) {
         return res.status(400).json({ message: "Lo username non può superare i 20 caratteri" });
    };
    if(password!==confermapassword){
        return res.status(400).json({message:'Le password non corrispondono'});
    };
      
    if (password.length < 6) {
      return res.status(400).json({ message: "La password deve contenere almeno 6 caratteri" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email non valida" });
    }

    const userExist= await User.findOne({$or:[{email},{username}]});
    if(userExist){
        return res.status(400).json({message:'Email o username già in uso'});
    };


    const hashedpassword= await bcrypt.hash(password,10);
    const NewUser= new User({
        nome,
        cognome,
        username,
        email,
        password:hashedpassword,
        ruolo
    })
    if(NewUser){
        await NewUser.save();
        gentToken(NewUser._id,res);

        res.status(201).json({
            _id:NewUser._id,
            username:NewUser.username,
            nome:NewUser.nome,
            cognome:NewUser.cognome,
            email:NewUser.email,
            ruolo:NewUser.ruolo,
        });      
    }
    else{
        res.status(400).json({message:'Dati utente non validi'});
} }catch (error) {
    console.log("Errore durante la registrazione:", error.message);
    res.status(500).json({message:'Errore del server'});
}
};

export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user= await User.findOne({$or:[{username},{email: username}]});
        const passwordCorrect=await bcrypt.compare(password,user?.password ||'');

        if(!user || !passwordCorrect){
            return res.status(400).json({message:'Username o password errati'});
        };

        gentToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            username:user.username,
            nome:user.nome,
            cognome:user.cognome,
            email:user.email,
            ruolo:user.ruolo,
        });
    } catch (error) {
        console.log("Errore durante il login:", error.message);
        res.status(500).json({message:'Errore del server'});
    }
};

export const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0});
        res.status(200).json({message:'Logout effettuato con successo'});
    } catch (error) {
        console.log("Errore durante il logout:", error.message);
        res.status(500).json({message:'Errore del server'});
    }
};

export const aggiornaUtente=async(req,res)=>{
    try {
        const { username, nome, cognome, email, password} = req.body;

        const user= await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
      
        if (username && username.length > 20) {
            return res.status(400).json({ message: "L'username non può superare i 20 caratteri" });
        };

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email non valida" });
            }

      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: "Email già in uso da un altro utente" });
      }
    }

    if (username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: user._id } });
      if (usernameExists) {
        return res.status(400).json({ message: "Username già in uso da un altro utente" });
      }
    }

        
    if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "La password deve contenere almeno 6 caratteri" }); }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    }

        
    if (username) user.username = username;
    if (nome) user.nome = nome;
    if (cognome) user.cognome = cognome;
    if (email) user.email = email;

    await user.save();
    io.emit("user_updated", { userId:user._id, username:user.username });

    gentToken(user._id, res);        
    res.status(200).json({
             _id:user._id,
            username:user.username,
            nome:user.nome,
            cognome:user.cognome,
            email:user.email,
            ruolo: user.ruolo 

    });
    } catch (error) {
        console.log('Errore durante le moidifiche al profilo', error.message);
        return res.status(500).json({ error: 'Errore del Server' });
    }
};

export const cercaUtenti = async (req, res) => {
  try {
    const users = await User.find().select("username _id"); 
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
};