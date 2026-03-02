import express from "express";
import protectRoute from "../Middleware/ProtectRoute.js"
import { registrazione, login, logout, aggiornaUtente, cercaUtenti} from "../Controller/User_controller.js";

const router=express.Router();
router.post('/registrazione',registrazione);
router.post('/login',login);
router.post('/logout',logout);
router.put('/aggiornaUtente/:id',protectRoute,aggiornaUtente);
router.get('/cercaUtenti',cercaUtenti)
router.get("/me", protectRoute, (req, res) => {
  res.json({ _id: req.user._id, username: req.user.username });
});

export default router;