import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNotifiche } from "../Layout/Notifiche/NotificheProvider"

const SERVER_URL = "https://apuliaeventsbackend.onrender.com";

export function useChat(selectedUserId, selectedUsername, setNuovoMessaggio) {
    
    const { socket,clearNotificationForUser } = useNotifiche();
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const isChatReady = !!selectedUserId;
    const [titleName, setTitleName] = useState(selectedUsername);

    useEffect(() => {
            if (!selectedUserId) return;
            clearNotificationForUser({type: "message",fromUserId: selectedUserId,});
            localStorage.setItem("chatAperta", selectedUserId);
        }, [selectedUserId, clearNotificationForUser]);


        useEffect(() => {
            setTitleName(selectedUsername);
        }, [selectedUsername]);

        useEffect(() => {
            if (selectedUserId) {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }
        }, [selectedUserId]);

        const scrollToBottom = () => {
            setTimeout(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }
            }, 0);
        }

        useEffect(() => {
            if (!socket) return;

            const onUserUpdated = (data) => {
                if (data.userId === selectedUserId) {
                    setTitleName(data.username);
                }
            };

            socket.on("user_updated", onUserUpdated);
            return () => socket.off("user_updated", onUserUpdated);
        }, [socket, selectedUserId]);

        useEffect(() => {
            if (selectedUserId) localStorage.setItem("chatAperta", selectedUserId);
            else localStorage.removeItem("chatAperta");
            return () => localStorage.removeItem("chatAperta");
        }, [selectedUserId]);

        useEffect(() => {
            if (!isChatReady) {
                setMessages([]);
                return;
            }

            (async () => {
                try {
                    const res = await fetch(
                        `${SERVER_URL}/api/messaggi/Messaggi/${selectedUserId}`,
                        { method: "GET", credentials: "include" }
                    );
                    if (!res.ok) throw new Error("Errore nel recupero messaggi");
                    const data = await res.json();
                    setMessages(data);

                    if (data.some((m) => !m.Letto && m.IdMittente === selectedUserId)) {
                        await fetch(
                            `${SERVER_URL}/api/messaggi/SegnaComeLetto/${selectedUserId}`,
                            { method: "PUT", credentials: "include" }
                        );
                    }
                } catch (err) {
                    console.error("Errore nel recupero messaggi:", err);
                }
            })();
        }, [selectedUserId, isChatReady]);

        useEffect(() => {
            if (!socket) return;

            const onNewMessage = (msg) => {
                if (
                    msg.IdMittente !== selectedUserId &&
                    msg.IdRicevente !== selectedUserId
                )
                    return;

                const nomeMittente =
                    msg.IdMittente === user._id
                        ? msg.usernameRicevente
                        : msg.usernameMittente;

                setMessages((prev) => [...prev, { ...msg, nomeMittente }]);

                if (setNuovoMessaggio) setNuovoMessaggio(msg);

                if (msg.IdMittente === selectedUserId) {
                    fetch(`${SERVER_URL}/api/messaggi/SegnaComeLetto/${selectedUserId}`, {
                        method: "PUT",
                        credentials: "include",
                    }).catch(() => {});

                    clearNotificationForUser({type: "message",fromUserId: selectedUserId,});
                }
            };

            socket.on("nuovoMessaggio", onNewMessage);
            return () => socket.off("nuovoMessaggio", onNewMessage);
        }, [socket, selectedUserId, setNuovoMessaggio, user._id, clearNotificationForUser]);


        useEffect(() => scrollToBottom(), [messages]);

        const handleSend = async (e) => {
            e.preventDefault();
            if (!newMessage.trim() || !isChatReady) return;

            const testo = newMessage.trim();
            setNewMessage("");

            try {
                const res = await fetch(
                    `${SERVER_URL}/api/messaggi/InviaMessaggio/${selectedUserId}`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ Messaggio: testo }),
                    }
                );

                if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
                await res.json(); 
            } catch (err) {
                console.error("Errore durante l'invio del messaggio:", err);
            }
        };

    return {
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        messagesEndRef,
        messagesContainerRef,
        isChatReady,
        titleName,
        userId: user._id
    };
}