import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import MapIcon from "@mui/icons-material/Map";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useSelector } from "react-redux";
import { useNotifiche } from "../Notifiche/NotificheProvider";
import ChatList from "./Listachat";

const drawerWidth = 240;

export default function Sidebar({
  setactiveContent,
  setUtenteSelezionato,
  setUtenteSelezionatoOggetto,
  onToggleDrawer
}) {

  const { user } = useSelector((state) => state.auth);
  const { socket } = useNotifiche();   
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openChatList, setOpenChatList] = useState(false);
  const [openMyEvents, setOpenMyEvents] = useState(false);
  const [conversazioni, setConversazioni] = useState([]);
  const { clearNotificationForUser } = useNotifiche();
  useEffect(() => {
    if (onToggleDrawer) {
      onToggleDrawer(() => setMobileOpen(prev => !prev));
    }
  }, [onToggleDrawer]);

  useEffect(() => {
    if (!openChatList) return;
    loadChats();
  }, [openChatList]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const onMsg = async (msg) => {
      if (msg.IdMittente !== user._id && msg.IdRicevente !== user._id) return;
      await loadChats(); 
    };

    socket.on("nuovoMessaggio", onMsg);
    return () => socket.off("nuovoMessaggio", onMsg);
  }, [socket, user?._id]);

  useEffect(() => {
    if (!socket) return;

    const onUpdate = data => {
      setConversazioni(prev =>
        prev.map(c =>
          c.utente._id === data.userId
            ? { ...c, utente: { ...c.utente, username: data.username } }
            : c
        )
      );
    };

    socket.on("user_updated", onUpdate);
    return () => socket.off("user_updated", onUpdate);
  }, [socket]);

  const loadChats = async () => {
  try {
    const r = await fetch("http://localhost:5001/api/messaggi/Conversazioni", {
      credentials: "include"
    });
    const data = await r.json();
    setConversazioni(data);
  } catch (err) {
    console.error("Errore fetch conversazioni:", err);
  }
};

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        backgroundColor: "#063257",
        color: "white",
        height: "100%",
        pt: "64px",
        overflowY: "auto"
      }}
    >
      <List>

        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setactiveContent("home")}>
            <ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home Page" />
          </ListItemButton>
        </ListItem>

        {/* Eventi */}
        {user?.ruolo === "Organizzatore" ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpenMyEvents(!openMyEvents)} >
                <ListItemIcon sx={{ color: "white" }}>
                  < EventIcon/>
                </ListItemIcon>
                <ListItemText primary="I miei eventi" />
                {openMyEvents ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMyEvents}>
                <List sx={{ pl: 2}}>
                  
                    <ListItemButton onClick={() => setactiveContent("myevents_pubblicati")}
                      sx={{ "&:hover": { backgroundColor: "#04243eff",},}}>
                      <ListItemIcon sx={{ color: "white" }}>
                          <EditCalendarIcon/>
                      </ListItemIcon>
                    <ListItemText primary="Eventi pubblicati" />
                   </ListItemButton>

                <ListItemButton onClick={() => setactiveContent("myevents_iscritti")}
                  sx={{"&:hover": { backgroundColor: "#04243eff",},}}>
                  <ListItemIcon sx={{ color: "white" }}>
                    <EventAvailableIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Eventi a cui partecipi" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => setactiveContent("myevents_iscritti")}>
              <ListItemIcon sx={{ color: "white" }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="I miei eventi" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Chat */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenChatList(!openChatList)}>
            <ListItemIcon sx={{ color: "white" }}><ChatIcon /></ListItemIcon>
            <ListItemText primary="Chat" />
            {openChatList ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        {/* Lista Chat */}
        <Collapse in={openChatList}>
           <ChatList
                conversazioni={conversazioni}
                onSelectChat={async (utente) => {
        setUtenteSelezionato(utente._id);
        setUtenteSelezionatoOggetto(utente);
        setactiveContent("chat");
        
        await clearNotificationForUser({
        type: "message",
        fromUserId: utente._id
    });


        // Segna come letti
        await fetch(`http://localhost:5001/api/messaggi/SegnaComeLetto/${utente._id}`, {
            method: "PUT",
            credentials: "include",
        });

        // Ricarica conversazioni
        await loadChats();
    }}
            />
        </Collapse>
        
        {/* Mappa */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setactiveContent("map")}>
            <ListItemIcon sx={{ color: "white" }}><MapIcon /></ListItemIcon>
            <ListItemText primary="Mappa" />
          </ListItemButton>
        </ListItem>

      </List>

      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Box component="nav">
      <CssBaseline />

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: "#063257" }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#063257",
            borderRight: "none"
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
