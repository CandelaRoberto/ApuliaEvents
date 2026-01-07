import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", { withCredentials: true });

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

        socket.on("posts_updated", () => {

            fetch(`http://localhost:5001/api/post/posts`)
                .then(res => res.json())
                .then(all => {
                    const updated = all.find(p => p._id === postId);
                    if (updated) setLista(updated.partecipanti);
                });
        });

        return () => socket.off("posts_updated");
    }, [postId]);

    return {
        open,
        lista,
        openIscritti,
        closeIscritti
    };
}
