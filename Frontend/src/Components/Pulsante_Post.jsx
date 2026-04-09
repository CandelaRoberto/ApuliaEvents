import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Post from "../Layout/Main/HomePage/Crea_Evento"
import PostAddIcon from '@mui/icons-material/PostAdd';
import Typography from '@mui/material/Typography';

export default function BasicModal({ onNewPostCreated }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                onClick={handleOpen}
                sx={{
                    position: "absolute",
                    top: "71px",
                    right: "15px",
                    zIndex: 10,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'Rische', sans-serif",
                        color: "#ffffffff",
                        fontWeight: "bold",
                        fontSize: "1.1rem"
                    }}
                >
                    Pubblica Evento
                </Typography>
                <PostAddIcon sx={{ color: "#fffdfdff" }} />
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: "blur(3px)" 
                }}
            >
                <Box
                    sx={{
                        outline: 'none',
                        p: 0,
                        maxWidth: "100%",
                        maxHeight: "100vh", 
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Post
                        onPostCreated={() => {
                            if (onNewPostCreated) onNewPostCreated();
                            handleClose();
                        }}
                    />
                </Box>
            </Modal>
        </div>
    );
}