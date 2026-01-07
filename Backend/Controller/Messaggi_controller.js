import Conversazione from "../Modelli/Conversazione_model.js";
import Messaggi from "../Modelli/Messaggi_model.js";
import Notification from "../Modelli/Notifiche_model.js";
import { io, getSocketIdRicevente } from "../Socket/Socket.js";
import User from "../Modelli/Users_models.js";

export const inviaMessaggio = async (req, res) => {
  try {
    const { Messaggio } = req.body;
    const IdMittente = req.user._id;
    const IdRicevente = req.params.IdRicevente;

    let conversazione = await Conversazione.findOne({
      membri: { $all: [IdMittente, IdRicevente] },
    });

    if (!conversazione) {
      conversazione = await Conversazione.create({
        membri: [IdMittente, IdRicevente],
      });
    }

    const newMessaggio = new Messaggi({
      IdMittente,
      IdRicevente,
      Messaggio,
      Letto: false,
      createdAt: new Date(),
    });

    if (newMessaggio) {
      conversazione.messaggi.push(newMessaggio._id);
    }

    await Promise.all([conversazione.save(), newMessaggio.save()]);

    const mittente = await User.findById(IdMittente).select("username");
    const ricevente = await User.findById(IdRicevente).select("username");

    const offline = await Notification.findOne({
      user: IdRicevente,
      fromUser: IdMittente,
      type: "message",
      seen: false
    });

        if (offline) {
          offline.count += 1;
          await offline.save();
        } else {
          await Notification.create({
            user: IdRicevente,
            type: "message",
            fromUser: IdMittente,
            count: 1
          });
        }

    const receiverSocketId = getSocketIdRicevente(IdRicevente);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("nuovoMessaggio", {
        ...newMessaggio._doc,
        usernameMittente: mittente?.username || "Sconosciuto",
        usernameRicevente: ricevente?.username || "Sconosciuto",
      });
    }

    const senderSocketId = getSocketIdRicevente(IdMittente);
    if (senderSocketId) {
      io.to(senderSocketId).emit("nuovoMessaggio", {
        ...newMessaggio._doc,
        usernameMittente: mittente?.username || "Sconosciuto",
        usernameRicevente: ricevente?.username || "Sconosciuto",
      });
    }

    res.status(201).json(newMessaggio);
  } catch (error) {
    console.log("Errore nell invio del messaggio:", error.message);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const getMessaggi=async(req,res)=>{
    try{
        const IdUtenteChat=req.params.IdUtenteChat; 
        const IdMittente=req.user._id;
        const conversazione=await Conversazione.findOne({
              membri: { $all: [IdMittente, IdUtenteChat] },
        }).populate('messaggi'); 
        if(!conversazione) return res.status(200).json([]);
        const messaggi=conversazione.messaggi;
        res.status(200).json(messaggi);
    }catch(error){
        console.log('Errore nel recupero dei messaggi: ', error.message);
        res.status(500).json({error:'Errore Interno del Server'});
    }
};

export const segnaComeLetto = async (req, res) => {
  try {
    const IdMittente = req.params.IdMittente; 
    const IdRicevente = req.user._id; 

    await Messaggi.updateMany(
      { IdMittente, IdRicevente, Letto: false },
      { $set: { Letto: true } }
    );

    await Notification.deleteMany({
      user: IdRicevente,
      fromUser: IdMittente,
      type: "message",
      seen: false
    });
    res.status(200).json({ message: "Messaggi segnati come letti" });
  } catch (error) {
    console.log("Errore nelle Notifiche: ", error.message);
    res.status(500).json({ error: "Errore Interno del Server" });
  }
};


export const getNotifiche = async (req, res) => {
  try {
    const IdUtente = req.user._id;

    // Trova tutti i messaggi non letti dell'utente loggato
    const notifiche = await Messaggi.aggregate([
      { $match: { IdRicevente: IdUtente, Letto: false } },
      {
        $group: {
          _id: "$IdMittente",
          nonLetti: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "mittente",
        },
      },
      {
        $project: {
          _id: 0,
          mittenteId: "$_id",
          nomeMittente: { $arrayElemAt: ["$mittente.username", 0] },
          nonLetti: 1,
        },
      },
    ]);

    res.status(200).json(notifiche);
  } catch (error) {
    console.log("Errore nel recupero Notifiche:", error.message);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const getConversazioni = async (req, res) => {
  try {
    const userId = req.user._id;
    const messaggi = await Messaggi.find({
      $or: [{ IdMittente: userId }, { IdRicevente: userId }]
    })
      .sort({ createdAt: -1 }) 
      .lean();

    if (!messaggi.length) {
      return res.status(200).json([]);
    }

    const conversazioniMap = new Map();

    for (const msg of messaggi) {
      const altroUtenteId = msg.IdMittente.equals(userId)
        ? msg.IdRicevente
        : msg.IdMittente;

      if (!conversazioniMap.has(String(altroUtenteId))) {
        conversazioniMap.set(String(altroUtenteId), msg);
      }
    }

    const risultati = await Promise.all(
      Array.from(conversazioniMap.entries()).map(async ([id, msg]) => {
        const utente = await User.findById(id).select("_id username");
        const nonLetti = await Messaggi.countDocuments({
              IdMittente: utente._id,
              IdRicevente: userId,
              Letto: false
            });
        return {
          utente,
          ultimoMessaggio: msg.Messaggio,
          dataUltimoMessaggio: msg.createdAt,
          nonLetti
        };
      })
    );

    res.status(200).json(risultati);
  } catch (error) {
    console.error("Errore nel recupero conversazioni:", error);
    res.status(500).json({ message: "Errore nel recupero conversazioni" });
  }
};
