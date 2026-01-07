import Post from "../Modelli/Post_model.js";
import Notification from "../Modelli/Notifiche_model.js";
import cloudinary from "../Utils/Cloudinary.js";
import { io, getSocketIdRicevente } from "../Socket/Socket.js";

export const CreaPost = async (req, res) => {
  try {
    const { titolo, descrizione, dataEvento, oraEvento, luogo, prezzo, bigliettiTotali, bigliettiDisponibili, lat, lng } = req.body;
   
    if (!titolo || titolo.trim().length < 3)
      return res.status(400).json({ message: "Il titolo deve contenere almeno 3 caratteri" });

    if (titolo.length > 30)
      return res.status(400).json({ message: "Il titolo non può superare 30 caratteri" });

    if (!descrizione || descrizione.trim().length < 10)
      return res.status(400).json({ message: "La descrizione deve contenere almeno 10 caratteri" });

    if (descrizione.length > 70)
      return res.status(400).json({ message: "La descrizione non può superare 70 caratteri" });

    if (!dataEvento || isNaN(new Date(dataEvento)))
      return res.status(400).json({ message: "Data non valida" });

    const oggi = new Date();
    if (new Date(dataEvento) < oggi)
      return res.status(400).json({ message: "Data non valida" });

    if (isNaN(prezzo) || prezzo < 0)
      return res.status(400).json({ message: "Prezzo non valido" });

    if (!bigliettiTotali || isNaN(bigliettiTotali) || Number(bigliettiTotali) < 1)
      return res.status(400).json({ message: "I biglietti totali devono essere almeno 1" });

        if (!req.file) {
      return res.status(400).json({ message: "La locandina è obbligatoria" });
    }

    if (!lat || !lng) {
      return res.status(400).json({ message: "Coordinate mappa mancanti" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "locandine" },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      stream.end(req.file.buffer);
    });

    const newPost = new Post({
      titolo,
      descrizione,
      locandina: result.secure_url,
      dataEvento: new Date(dataEvento),
      oraEvento,
      prezzo:Number(prezzo),
      bigliettiTotali: Number(bigliettiTotali),
      bigliettiDisponibili: Number(bigliettiTotali),
      organizzatore: req.user._id,
      location: {
        address: luogo,
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      }
    });

    await newPost.save();
    io.emit("posts_updated");
    res.status(201).json(newPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};

export const ModificaPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    if (post.organizzatore.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    const updatedData = {};

    [
      "titolo",
      "descrizione",
      "dataEvento",
      "oraEvento",
    ].forEach(f => {
      if (req.body[f] !== undefined) updatedData[f] = req.body[f];
    });
    ["prezzo","bigliettiTotali","bigliettiDisponibili"].forEach(f => {
      if (req.body[f] !== undefined) updatedData[f] = Number(req.body[f]);
    });

    if (req.body.titolo) {
  if (req.body.titolo.trim().length < 3)
    return res.status(400).json({ message: "Il titolo deve contenere almeno 3 caratteri" });

  if (req.body.titolo.length > 30)
    return res.status(400).json({ message: "Il titolo non può superare 30 caratteri" });
}
if (req.body.descrizione !== undefined) {

  if (!req.body.descrizione || req.body.descrizione.trim().length < 10) {
    return res.status(400).json({ message: "La descrizione deve contenere almeno 10 caratteri" });
  }

  if (req.body.descrizione.length > 70) {
    return res.status(400).json({ message: "La descrizione non può superare 70 caratteri" });
  }
}

if (req.body.location) {
  let loc = req.body.location;

  if (typeof loc === "string") {
    try { loc = JSON.parse(loc); } catch (e) {}
  }

  updatedData.location = {
    address: loc.address,
    coordinates: {
      lat: parseFloat(loc.coordinates.lat),
      lng: parseFloat(loc.coordinates.lng)
    }
  };
}

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "locandine" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(req.file.buffer);
      });
      updatedData.locandina = result.secure_url;
    }

     if (updatedData.bigliettiTotali !== undefined) {
      if (Number(updatedData.bigliettiTotali) < post.partecipanti.length) {
            return res.status(400).json({
              message: `Ci sono già ${post.partecipanti.length} partecipanti. 
                        Non puoi impostare un numero di biglietti inferiore.`
    });
  }
      updatedData.bigliettiDisponibili = updatedData.bigliettiTotali - post.partecipanti.length;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedData,
      { new: true }
    );
    io.emit("posts_updated");
    io.emit("evento_aggiornato", {postId: updatedPost._id,nuovoTitolo: updatedPost.titolo});

    res.status(200).json(updatedPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};

export const EliminaPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    if (post.organizzatore.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorizzato a eliminare questo post" });
    }

    await Notification.deleteMany({ event: postId });
    await Post.findByIdAndDelete(postId);
    io.emit("posts_updated");
    io.emit("notifiche_refresh");
    res.status(200).json({ message: "Post eliminato con successo" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};

export const OttieniPost = async (req, res) => {
  try {
    const oggi = new Date();
    oggi.setHours(0,0,0,0);

    await Post.deleteMany({ dataEvento: { $lt: oggi } });

    const posts = await Post.find({
      dataEvento: { $gte: oggi }
    })
      .sort({ dataEvento: 1,oraEvento: 1  })
      .populate("organizzatore", "username")
      .populate("partecipanti", "_id username");

    res.status(200).json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};

export const partecipaEvento = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Evento non trovato" });

    if (post.partecipanti.includes(req.user._id)) {
      return res.status(400).json({ message: "Partecipi già a questo evento" });
    }

    if (post.bigliettiDisponibili <= 0) {
      return res.status(400).json({ message: "Non ci sono più biglietti disponibili" });
    }

    post.partecipanti.push(req.user._id);
    post.bigliettiDisponibili = post.bigliettiTotali - post.partecipanti.length;

    await post.save();
    await Notification.create({
        user: post.organizzatore,    
        type: "event",
        fromUser: req.user._id,
        event: post._id
    });

      const socketIdOrganizzatore = getSocketIdRicevente(post.organizzatore.toString());
      if (socketIdOrganizzatore) {
        io.to(socketIdOrganizzatore).emit("nuovaNotificaPartecipazione", {
          tipo: "partecipazione",
          username: req.user.username,
          fromUserId: req.user._id,
          evento: { _id: post._id, titolo: post.titolo },
          postId: post._id
  });
}
  io.emit("posts_updated");


    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rinunciaEvento = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Evento non trovato" });

    if (!post.partecipanti.includes(req.user._id)) {
      return res.status(400).json({ message: "Non partecipi a questo evento" });
    }

    post.partecipanti = post.partecipanti.filter(
      (uid) => uid.toString() !== req.user._id.toString()
    );

    post.bigliettiDisponibili = post.bigliettiTotali - post.partecipanti.length;
    await post.save();
    await Notification.findOneAndDelete({type: "event",fromUser: req.user._id,event: post._id});
    const socketIdOrganizzatore = getSocketIdRicevente(post.organizzatore.toString());
    io.to(socketIdOrganizzatore).emit("partecipazione_rimossa", {
                postId: post._id,
                fromUserId: req.user._id
            });
    io.emit("posts_updated");
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
