import express from "express";
import protectRoute from "../Middleware/ProtectRoute.js";
import { creaNotifica,segnaComeVista} from "../Controller/Notifiche_controller.js";

const router=express.Router();
router.get('/notifiche', protectRoute, creaNotifica);
router.put("/segnaComeVista", protectRoute, segnaComeVista);

export default router;
