import express from "express";
import upload from "../Middleware/multer.js";
import protectRoute from "../Middleware/ProtectRoute.js";
import { VerificaRuolo } from "../Middleware/VerificaRuolo.js";
import { CreaPost, ModificaPost, EliminaPost, OttieniPost,partecipaEvento,rinunciaEvento} from "../Controller/Post_controller.js";

const router=express.Router();
router.post('/pubblicaPost', protectRoute, VerificaRuolo, upload.single('locandina'), CreaPost);
router.put('/posts/:id', protectRoute, upload.single('locandina'), ModificaPost);
router.delete('/posts/:id', protectRoute, EliminaPost)
router.get('/posts', OttieniPost);
router.post('/posts/:id/partecipa', protectRoute, partecipaEvento);
router.post('/posts/:id/rinuncia', protectRoute, rinunciaEvento);

export default router;
