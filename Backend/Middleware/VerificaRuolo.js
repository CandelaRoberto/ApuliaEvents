export const VerificaRuolo = (req, res, next) => {
  const user = req.user; 

  if (!user || user.ruolo !== "Organizzatore") {
    return res.status(403).json({ message: "Accesso negato: solo organizzatori" });
  }

  next();
};