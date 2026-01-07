import Notifica from "../Modelli/Notifiche_model.js";

export const creaNotifica = async (req, res) => {
  try{
    const notif = await Notifica.find({ user:req.user._id, seen:false })
    .populate("fromUser", "username")
    .populate("event", "titolo");

    const converted = notif.map(n => ({
      type: n.type === "event" ? "event" : "message",
      tipo: n.type === "event" ? "partecipazione" : "messaggio",
      username: n.fromUser?.username,
      fromUserId: n.fromUser?._id,
      userId: n.fromUser?._id,          
      evento: n.event ? { titolo: n.event.titolo, postId: n.event._id } : null,
      count:  n.count
    }));

    res.json(converted);

  } catch (err){
    res.status(500).json({message:err.message});
  }
};

export const segnaComeVista = async(req,res)=>{
  try{
    const { fromUserId, type, postId } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: "Tipo Mancante" });
    }

    if (type === "message") {
      await Notifica.deleteMany({
        user: req.user._id,
        fromUser: fromUserId,
        type: "message",
        seen: false
      });
    }

    if (type === "event") {
      await Notifica.deleteOne({
        user: req.user._id,
        fromUser: fromUserId,
        type: "event",
        event: postId,
        seen: false
      });
    }

    return res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};