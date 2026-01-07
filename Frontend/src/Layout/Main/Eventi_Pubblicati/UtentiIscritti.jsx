import { Modal, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";

export const UtentiIscritti = ({ open, onClose, lista }) => {

    const [page, setPage] = useState(0);
    const pageSize = 10;

    const paginatedList = lista.slice(page * pageSize, (page + 1) * pageSize);

    const nextPage = () => {
        if ((page + 1) * pageSize < lista.length) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    useEffect(() => {
        setPage(0); 
    }, [lista]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    background: "#001126",
                    borderRadius: 3,
                    p: 3,
                    width: { xs: "90%", sm: "400px" },
                    mx: "auto",
                    mt: "12vh",
                    color: "#fff",
                    maxHeight: "70vh",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    fontFamily: "'Rische', sans-serif",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Rische', sans-serif" }}>
                    Partecipanti: {lista.length}
                </Typography>

                {paginatedList.length === 0 ? (
                    <Typography sx={{fontFamily:"'Rische', sans-serif"}}>Nessun partecipante è iscritto all'evento!</Typography>
                ) : (
                    paginatedList.map((u) => (
                        <Box
                            key={u._id}
                            sx={{
                                borderBottom: "1px solid #123",
                                py: 1,
                                fontSize: "1rem",
                            }}
                        >
                            {u.username}
                        </Box>
                    ))
                )}

                {/* FRECCE PAGINAZIONE */}
                {lista.length > pageSize && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <IconButton onClick={prevPage} disabled={page === 0} sx={{ color: "#4fc3f7" }}>
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        <IconButton
                            onClick={nextPage}
                            disabled={(page + 1) * pageSize >= lista.length}
                            sx={{ color: "#4fc3f7" }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};
