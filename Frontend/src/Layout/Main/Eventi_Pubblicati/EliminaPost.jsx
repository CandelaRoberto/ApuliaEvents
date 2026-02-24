import { Dialog, DialogTitle, DialogActions, Button, Fade } from "@mui/material";

export const EliminaPost = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    backgroundColor: "#001126",
                    fontFamily: "'Rische', sans-serif",
                }
            }}
        >
            <DialogTitle sx={{ color: "#fff", fontFamily: "'Rische', sans-serif" }}>
                Eliminare questo post?
            </DialogTitle>

            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#42a5f5",
                        fontFamily: "'Rische', sans-serif",
                    }}
                >
                    Annulla
                </Button>

                <Button
                    color="error"
                    onClick={onConfirm}
                    sx={{
                        fontFamily: "'Rische', sans-serif",
                    }}
                >
                    Elimina
                </Button>
            </DialogActions>
        </Dialog>
    );
};
