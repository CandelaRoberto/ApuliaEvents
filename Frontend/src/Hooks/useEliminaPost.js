import { useState } from "react";
import { useNotifiche } from "../Layout/Notifiche/NotificheProvider";

export function useEliminaPost(onUpdatedPosts) {
    
    const { setNotifiche } = useNotifiche();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        await fetch(`http://localhost:5001/api/post/posts/${postToDelete._id}`, {
            method: "DELETE",
            credentials: "include",
        });
        onUpdatedPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));

        try {
            const res = await fetch("http://localhost:5001/api/notifiche/notifiche", {
                credentials: "include",
            });
            const updated = await res.json();
            setNotifiche(updated); 
        } catch (err) {
            console.error("Errore aggiornamento notifiche:", err);
        }

        setOpenDeleteDialog(false);
        setPostToDelete(null);
    };
    return {
        openDeleteDialog,
        setOpenDeleteDialog,
        postToDelete,
        setPostToDelete,
        handleConfirmDelete
    };
}