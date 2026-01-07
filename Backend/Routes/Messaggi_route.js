import {inviaMessaggio, getMessaggi, segnaComeLetto,getNotifiche,getConversazioni} from '../Controller/Messaggi_controller.js';
import protectRoute from '../Middleware/ProtectRoute.js';
import express from 'express';

const router = express.Router();

router.post("/InviaMessaggio/:IdRicevente", protectRoute, inviaMessaggio);
router.get("/Messaggi/:IdUtenteChat", protectRoute, getMessaggi);
router.put("/SegnaComeLetto/:IdMittente", protectRoute, segnaComeLetto);
router.get("/Notifiche", protectRoute, getNotifiche);
router.get("/Conversazioni", protectRoute, getConversazioni);

export default router;
