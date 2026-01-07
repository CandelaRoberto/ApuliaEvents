import { Menu, MenuItem, Box, Typography, Icon, IconButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNotifiche } from "./NotificheProvider";
import { useState,useEffect } from "react";

export default function NotificheMenu({ anchorEl, onClose, onApriChat }) {
  const { notifiche, clearNotificationForUser } = useNotifiche();

  const [page, setPage] = useState(0);
  const pageSize = 3;

  const totalPages = Math.ceil(notifiche.length / pageSize);

  const currentNotifications = notifiche.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const plurale = (num, sing, plur) => (num === 1 ? sing : plur);

  const handleClick = async (globalIdx, n) => {
  //  Rimuove dalla lista notifiche + update backend notifiche
  await clearNotificationForUser({
    type: n.type,
    fromUserId: n.fromUserId,
    postId: n.evento?.postId
  });
  if (n.type === "message") {
    await fetch(`http://localhost:5001/api/messaggi/SegnaComeLetto/${n.fromUserId}`, {
      method: "PUT",
      credentials: "include"
    });
  }
  if (page > 0 && globalIdx === page * pageSize && page === totalPages - 1) {
    setPage((p) => p - 1);
  }

  onClose();
  if (n.type === "message") onApriChat(n);
};
useEffect(() => {
  const totalPages = Math.ceil(notifiche.length / pageSize);
  setPage(prevPage => Math.min(prevPage, Math.max(totalPages - 1, 0)));
}, [notifiche]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      transitionDuration={0}
      keepMounted={false}
      PaperProps={{
        sx: {
          mt: 1.1,
          transform: "translateX(-1000px)",
          backgroundColor: "#0e1a2b",
          color: "#fff",
          width: 300,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          p: 0,
        },
      }}
    >
      {/* LISTA NOTIFICHE */}
      {currentNotifications.length === 0 ? (
        <MenuItem
          sx={{
            py: 2,
            justifyContent: "center",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Nessuna nuova notifica
        </MenuItem>
      ) : (
        currentNotifications.map((n, i) => {
          const globalIndex = page * pageSize + i;

          return (
            <MenuItem
              key={i}
              onClick={() => handleClick(globalIndex, n)}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                whiteSpace: "normal",
                py: 1.8,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
              }}
            >
              <Icon
                component={n.type === "message" ? MailIcon : EventIcon}
                sx={{ fontSize: 22, color: "#ff9f43", mt: "2px" }}
              />

              <Box>
                {n.type === "message" ? (
                  <Typography sx={{ fontSize: ".97rem" }}>
                    Hai <strong>{n.count}</strong>{" "}
                    {plurale(n.count, "nuovo messaggio", "nuovi messaggi")} da{" "}
                    <strong>{n.username}</strong>
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: ".97rem" }}>
                    <strong>{n.username}</strong> si è iscritto a{" "}
                    <strong>{n.evento?.titolo}</strong>
                  </Typography>
                )}
              </Box>
            </MenuItem>
          );
        })
      )}

      {/* PAGINAZIONE */}
      {notifiche.length > pageSize && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 1,
            pb: 1,
            pt: 0.5,
          }}
        >
          {page > 0 ? (
            <IconButton
              size="small"
              onClick={() => setPage(page - 1)}
              sx={{ color: "white" }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          ) : (
            <Box sx={{ width: 32 }} />
          )}

          {page < totalPages - 1 && (
            <IconButton
              size="small"
              onClick={() => setPage(page + 1)}
              sx={{ color: "white" }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Menu>
  );
}
