import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://apuliaeventsbackend.onrender.com", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true
});

export function useIscritti() {

    const [open, setOpen] = useState(false);
    const [lista, setLista] = useState([]);
    const [postId, setPostId] = useState(null);

    const openIscritti = (post) => {
        setLista(post.partecipanti || []);
        setPostId(post._id);
        setOpen(true);
    };

    const closeIscritti = () => {
        setOpen(false);
        setLista([]);
        setPostId(null);
    };

    useEffect(() => {
        if (!postId) return;

        const handleUpdate = () => {
            fetch(`https://apuliaeventsbackend.onrender.com/api/post/posts`, {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(all => {
                    const updated = all.find(p => p._id === postId);
                    if (updated) setLista(updated.partecipanti);
                })
                .catch(err => console.error("Errore aggiornamento iscritti:", err));
        };

        socket.on("posts_updated", handleUpdate);

        return () => socket.off("posts_updated", handleUpdate);
    }, [postId]);

    return {
        open,
        lista,
        openIscritti,
        closeIscritti
    };
}
