import { useState, useEffect } from "react";
import { useNotifiche } from "../Layout/Notifiche/NotificheProvider";

export function useIscritti() {

    const {socket}= useNotifiche();
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
        if (!postId || !socket) return;

        const handleUpdate = async() => {
            try {
                const res = await fetch(`https://apuliaeventsbackend.onrender.com/api/post/posts`, {
                credentials: 'include'
            })
                const all = await res.json();
                const updated = all.find(p => p._id === postId);
                if (updated) setLista(updated.partecipanti);
            }
                catch(err){
                    console.error("Errore aggiornamento iscritti:", err);
                }
        };

        socket.on("posts_updated", handleUpdate);

        return () => socket.off("posts_updated", handleUpdate);
    }, [postId, socket]);

    return {
        open,
        lista,
        openIscritti,
        closeIscritti
    };
}
