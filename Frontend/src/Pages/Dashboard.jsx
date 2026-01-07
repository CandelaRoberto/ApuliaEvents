import * as React from "react";
import ResponsiveDrawer from "../Layout/SideBar/SideBar";
import ListaPost from "../Layout/Main/HomePage/Lista_Eventi";
import EventMap from "../Layout/Main/Mappa/EventMap";
import { useState, useEffect } from "react";
import BasicModal from "../Components/Pulsante_Post";
import ChatBox from "../Layout/Main/Chat/Chat";
import { useSelector } from "react-redux";
import ListaPostPersonali from "../Layout/Main/Eventi_Pubblicati/Eventi_Pubblicati";
import EventiIscritto from "../Layout/Main/Eventi_Iscritto/Eventi_iscritto";
import SfondoDashboard from "../Assets/sfondoDashboard.png";
import PrimarySearchAppBar from "../Layout/AppBar/AppBar";
import { StyledFormArea2 } from "../Components/styles";

import { useNotifiche } from "../Layout/Notifiche/NotificheProvider";
function getSidebarWidth() {
    if (typeof window !== "undefined") {
        if (window.innerWidth <= 480) return 0; 
        if (window.innerWidth <= 800) return 240; 
        if (window.innerWidth <= 1200) return 240;
    }
    return 240;
}

function getInlineResponsiveStyle() {
    const win = typeof window === "object" ? window.innerWidth : 1536;
    const base = {
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${SfondoDashboard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        margin: 0,
        padding: 0,
    };

    if (win <= 600) {
        return { ...base, display: "flex", flexDirection: "column" };
    }
    return { ...base, display: "flex", flexDirection: "row" };
}

const DashBoard = () => {
    const [activeContent, setactiveContent] = useState("home");
    const [utenteSelezionato, setUtenteSelezionato] = useState(null);
    const [utenteSelezionatoOggetto, setUtenteSelezionatoOggetto] = useState(null);
    const [toggleDrawerFn, setToggleDrawerFn] = React.useState(null);

    const [mainStyle, setMainStyle] = useState(getInlineResponsiveStyle());
    const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());

    useEffect(() => {
        const handleResize = () => {
            setMainStyle(getInlineResponsiveStyle());
            setSidebarWidth(getSidebarWidth());
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleRegisterDrawer = React.useCallback((fn) => {
        setToggleDrawerFn(() => fn);
    }, []);

    const [posts, setPosts] = useState([]);
    const [mapCenter, setMapCenter] = useState(null);

    const [nuovoMessaggio, setNuovoMessaggio] = useState(null);

    const { user } = useSelector((state) => state.auth);

    const handleOpenDrawer = React.useCallback(() => {
        if (toggleDrawerFn) toggleDrawerFn();
    }, [toggleDrawerFn]);

    const { socket } = useNotifiche();

    const selectedUsername = utenteSelezionatoOggetto?.username;
    const drawerWidth = 240;
  const loadPosts = async (isMounted) => {
  try {
    const res = await fetch("http://localhost:5001/api/post/posts");
    if (!res.ok) throw new Error("Errore caricamento post");
    const data = await res.json();

    const sorted = data
  .filter(p => p.dataEvento) 
  .sort((a, b) => {
    const dateA = new Date(`${a.dataEvento}T${a.oraEvento || '00:00:00'}`);
    const dateB = new Date(`${b.dataEvento}T${b.oraEvento || '00:00:00'}`);
    return dateA - dateB; 
  });

    if (isMounted) setPosts(sorted);

  } catch (err) {
    console.error(err);
  }
};

    useEffect(() => {
        let isMounted = true;
        loadPosts(isMounted);
        return () => { isMounted = false; };
    }, []);


    useEffect(() => {
        if (!socket) return;

        const reloadPosts = () => {
            loadPosts(true);
        };

        socket.on("posts_updated", reloadPosts);
        return () => socket.off("posts_updated", reloadPosts);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const onUserUpdated = (data) => {
            setPosts(prev => prev.map(p => {
                if (p.organizzatore?._id === data.userId) {
                    return {
                        ...p,
                        organizzatore: { ...p.organizzatore, username: data.username }
                    };
                }

                const nuoviPartecipanti = p.partecipanti?.map(partecipante =>
                    partecipante?._id === data.userId
                        ? { ...partecipante, username: data.username }
                        : partecipante
                );

                return { ...p, partecipanti: nuoviPartecipanti };
            }));
        };

        socket.on("user_updated", onUserUpdated);
        return () => socket.off("user_updated", onUserUpdated);
    }, [socket]);

    const handleShowOnMap = (coordinates) => {
        setMapCenter(coordinates);
        setactiveContent("map");
    };

    const handlePartecipa = async (postId) => {
    try {
        const response = await fetch(
            `http://localhost:5001/api/post/posts/${postId}/partecipa`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
                credentials: "include"
            }
        );
        if (!response.ok) throw new Error("Errore partecipazione");

        loadPosts(true);
    } catch (err) {
        console.error("Errore partecipazione:", err);
    }
};

    return (
        <div
            style={mainStyle}
        >
            {/* AppBar */}
            <PrimarySearchAppBar
                onOpenDrawer={handleOpenDrawer}
                setUtenteSelezionato={setUtenteSelezionato}
                setActiveContent={setactiveContent}
                setUtenteSelezionatoOggetto={setUtenteSelezionatoOggetto}
                drawerWidth={drawerWidth}
            />

            {/*SideBar */}
            <ResponsiveDrawer
                onToggleDrawer={handleRegisterDrawer}
                setactiveContent={setactiveContent}
                setUtenteSelezionato={setUtenteSelezionato}
                setUtenteSelezionatoOggetto={setUtenteSelezionatoOggetto}
            />

            {/* Main */}
            <div
                style={{
                    position: "fixed",
                    left: sidebarWidth,
                    top: 0,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <StyledFormArea2>

                    {activeContent === "chat" && (
                        utenteSelezionato ? (
                            <div style={{
                                position: "absolute", 
                                top: 64, 
                                left: 0,
                                right: 0,
                                bottom: 0, 
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "stretch",
                                padding: 0,
                                margin: 0, 
                            }}>
                                <ChatBox
                                    selectedUserId={utenteSelezionato}
                                    selectedUsername={selectedUsername}
                                    user={user}
                                    nuovoMessaggio={nuovoMessaggio}
                                    setNuovoMessaggio={setNuovoMessaggio}
                                />
                            </div>
                        ) : (
                            <div style={{
                                textAlign: "center",
                                marginTop: "5rem",
                                color: "#ccc",
                            }}>
                                Seleziona un utente per iniziare una chat
                            </div>
                        )
                    )}

                    
                    {activeContent === "home" && (
                        <>
                            <ListaPost
                                posts={posts}
                                setUtenteSelezionato={setUtenteSelezionato}
                                setUtenteSelezionatoOggetto={setUtenteSelezionatoOggetto}
                                setActiveContent={setactiveContent}
                                onShowOnMap={handleShowOnMap}
                                onPartecipa={handlePartecipa}
                            />

                            {user?.ruolo === "Organizzatore" && (
                                <BasicModal
                                    onNewPostCreated={() => loadPosts(true)}
                                />
                            )}
                        </>
                    )}

                    {activeContent === "map" && (
                        <EventMap events={posts} center={mapCenter} />
                    )}

                    {activeContent === "myevents_pubblicati" && (
                        <ListaPostPersonali
                            posts={posts}
                            setPosts={setPosts}
                            onShowOnMap={handleShowOnMap}
                        />
                    )}

                    {activeContent === "myevents_iscritti" && (
                        <EventiIscritto
                            posts={posts}
                            setPosts={setPosts}
                            setUtenteSelezionato={setUtenteSelezionato}
                            setUtenteSelezionatoOggetto={setUtenteSelezionatoOggetto}
                            setActiveContent={setactiveContent}
                            onShowOnMap={handleShowOnMap}
                        />
                    )}
                </StyledFormArea2>
            </div>
        </div>
    );
};

export default DashBoard;