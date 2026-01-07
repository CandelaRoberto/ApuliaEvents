import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../../Components/socketClient";

const NotificheContext = createContext(null);

export const NotificheProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [notifiche, setNotifiche] = useState([]);
  const [socket, setSocket] = useState(null);

  const clearNotificationForUser = async ({ type, fromUserId, postId }) => {
    
    if (type === "message" && !fromUserId) return;
    if (type === "event" && (!fromUserId || !postId)) return;
    
    setNotifiche(prev => {
      const filtered = prev.filter(n => {
        if (type === "message") return !(n.type === "message" && n.fromUserId === fromUserId);
        if (type === "event") return !(n.type === "event" && n.fromUserId === fromUserId && n.evento?.postId === postId);
        return true;
      });

      
      if (filtered.length === prev.length) return prev;
      return filtered;
    });

    try {
      await fetch("http://localhost:5001/api/notifiche/segnaComeVista", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, fromUserId, postId }),
      });
    } catch (err) {
      console.error("Errore notifiche", err);
    }
  };

 useEffect(() => {
  fetch("http://localhost:5001/api/user/me", { credentials: "include" })
    .then((r) => r.json())
    .then((u) => {
      if (u && u._id) {
        setUserId(u._id);
      }
    })
    .catch((err) => console.error("Errore ", err));
}, []);

useEffect(() => {
  if (userId === null) return; 
  const s = getSocket(userId);
  setSocket(s);
}, [userId]);

  useEffect(() => {
    if (userId === null) return;

    fetch("http://localhost:5001/api/notifiche/notifiche", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((offline) => {
        setNotifiche(() => {
          const merged = [];

          offline.forEach((n) => {
            const type = n.type; 

            if (type === "message") {
              const existing = merged.find(
                (x) =>
                  x.type === "message" && x.fromUserId === n.fromUserId
              );

              if (existing) {
                existing.count += n.count;
              } else {
                merged.push({
                  type: "message",
                  tipo: "messaggio",
                  fromUserId: n.fromUserId,
                  username: n.username,
                  count: n.count,
                });
              }
              return;
            }

            if (type === "event") {
              merged.push({
                type: "event",
                tipo: "partecipazione",
                fromUserId: n.fromUserId,
                userId: n.userId,
                username: n.username,
                evento: n.evento
                  ? {
                      titolo: n.evento.titolo,
                      postId: n.evento.postId,
                    }
                  : null,
                count: n.count,
              });
              return;
            }
          });

          return merged;
        });
      })
      .catch((err) => console.error("Errore notifiche ", err));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (msg.IdRicevente !== userId) return;

      const chatAperta = localStorage.getItem("chatAperta");

      if (chatAperta === msg.IdMittente) {
        clearNotificationForUser({
          type: "message",
          fromUserId: msg.IdMittente,
        });

        fetch(
          `http://localhost:5001/api/messaggi/SegnaComeLetto/${msg.IdMittente}`,
          {
            method: "PUT",
            credentials: "include",
          }
        ).catch(() => {});

        return;
      }

      const fromUserId = msg.IdMittente;

      setNotifiche((prev) => {
        const existing = prev.find(
          (n) => n.type === "message" && n.fromUserId === fromUserId
        );

        if (existing) {
          return prev.map((n) =>
            n.type === "message" && n.fromUserId === fromUserId
              ? { ...n, count: n.count + 1 }
              : n
          );
        }

        return [
          ...prev,
          {
            type: "message",
            tipo: "messaggio",
            fromUserId,
            username: msg.usernameMittente,
            count: 1,
          },
        ];
      });
    };

    socket.on("nuovoMessaggio", onNewMessage);

    return () => socket.off("nuovoMessaggio", onNewMessage);
  }, [socket, userId]);

  useEffect(() => {
    if (!socket) return;

    const onNuovaPartecipazione = (data) => {
      const senderId = data.userId ?? data.fromUserId;

      setNotifiche((prev) => [
        ...prev,
        {
          type: "event",
          tipo: "partecipazione",
          fromUserId: senderId,
          userId: senderId,
          username: data.username,
          evento: {
            titolo: data.evento.titolo,
            postId: data.evento._id,
          },
          count: 1,
        },
      ]);
    };

    socket.on("nuovaNotificaPartecipazione", onNuovaPartecipazione);

    return () =>
      socket.off("nuovaNotificaPartecipazione", onNuovaPartecipazione);
  }, [socket]);

  useEffect(() => {
  if (!socket) return;

  const onPartecipazioneRimossa = ({ postId, fromUserId }) => {
    setNotifiche(prev =>
      prev.filter(
        n =>
          !(
            n.type === "event" &&
            n.fromUserId === fromUserId &&
            n.evento?.postId === postId
          )
      )
    );
  };

  socket.on("partecipazione_rimossa", onPartecipazioneRimossa);
  return () => socket.off("partecipazione_rimossa", onPartecipazioneRimossa);
}, [socket]);

  useEffect(() => {
  if (!socket) return;

  const onEventoAggiornato = ({ postId, nuovoTitolo }) => {
    setNotifiche(prev =>
      prev.map(n =>
        n.type === "event" && n.evento?.postId === postId
          ? { ...n, evento: { ...n.evento, titolo: nuovoTitolo } }
          : n
      )
    );
  };

  socket.on("evento_aggiornato", onEventoAggiornato);
  return () => socket.off("evento_aggiornato", onEventoAggiornato);
}, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onUserUpdated = ({ userId, username }) => {
      setNotifiche((prev) =>
        prev.map((n) => {
          if (n.fromUserId === userId) {
            return { ...n, username };
          }

          if (
            n.type === "event" &&
            (n.userId === userId || n.fromUserId === userId)
          ) {
            return { ...n, username };
          }

          return n;
        })
      );
    };

    socket.on("user_updated", onUserUpdated);

    return () => socket.off("user_updated", onUserUpdated);
  }, [socket]);

  const rimuoviNotifica = (i) =>
    setNotifiche((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <NotificheContext.Provider
      value={{
        notifiche,
        rimuoviNotifica,
        setNotifiche,
        socket,
        clearNotificationForUser,
      }}
    >
      {children}
    </NotificheContext.Provider>
  );
};

export const useNotifiche = () => useContext(NotificheContext);
