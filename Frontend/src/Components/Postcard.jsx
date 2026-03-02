import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const PostCard = ({ post, user, responsive, onShowOnMap,footerType, onEdit, onDelete,onUnsubscribe,onChat,onPartecipa,onShowIscritti}) => {
    const isMine = post.organizzatore?._id === user?._id;
    const isPartecipante = post.partecipanti?.some(p => p._id === user._id); 
    const renderFooter = () => {
            switch (footerType) {
                case "owned":
                    return (
                        <>
                            <Tooltip title=" Iscritti" 
>
                                <IconButton
                                    sx={{ color: "#4fc3f7", padding: 0 }}
                                    onClick={() => onShowIscritti(post.partecipanti)}
                                >
                                    <PeopleAltIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifica">
                                <IconButton
                                    sx={{ color: "#ffb300", padding: 0 }}
                                    onClick={onEdit}
                                >
                                    <EditIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Elimina">
                                <IconButton
                                    sx={{ color: "#f44336", padding: 0 }}
                                    onClick={onDelete}
                                >
                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    );
                    
                case "joined":
                    return (
                        <>
                            <button
                                onClick={onUnsubscribe}
                                style={{
                                    backgroundColor: "#f44336",
                                    border: "2px solid #e53935",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "'Rische', sans-serif",
                                }}
                            >
                                Disiscriviti
                            </button>

                            <Tooltip title="Contatta organizzatore">
                                <IconButton
                                    sx={{ color: "#4fc3f7", padding: 0 }}
                                    onClick={onChat}
                                >
                                    <ChatIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    );
                    case "public":
                    return (
                        <>
                            {/* SOLD OUT */}
                            {!isMine && post.bigliettiDisponibili === 0 && (
                                <span style={{ color: "#ff3b3b", fontWeight: 600, fontSize: "0.75rem" }}>
                                    SOLD OUT
                                </span>
                            )}

                            {/* ISCRITTO */}
                            {!isMine && isPartecipante && (
                                <span style={{ color: "#4ff752", fontWeight: 600, fontSize: "0.75rem" }}>
                                    ISCRITTO
                                </span>
                            )}

                            {/* PARTECIPA */}
                            {!isMine && !isPartecipante && post.bigliettiDisponibili > 0 && (
                                <button
                                    onClick={onPartecipa}
                                    style={{
                                        backgroundColor: "#4fc3f7",
                                        border: "none",
                                        color: "#000",
                                        padding: "5px 10px",
                                        borderRadius: "6px",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        fontFamily: "'Rische', sans-serif",
                                    }}
                                >
                                    Partecipa
                                </button>
                            )}

                            {/* CHAT */}
                            {!isMine && (
                                <Tooltip title="Contatta organizzatore">
                                    <IconButton sx={{ color: "#4fc3f7", padding: 0 }} onClick={onChat}>
                                        <ChatIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    );
                default:
                    return null;
            }
        };
    return (
        <div
            style={{
                flexShrink: 0,
                width: `${responsive.cardWidth}px`,
                minHeight: "680px",
                border: "2px solid #1a4d7a",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,12,30,0.25)",
                backgroundColor: "#001126",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                scrollSnapAlign: "center",
                fontFamily: "'Rische', sans-serif",
            }}
        >
            {/* Header: Titolo e Data */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottom: "1px solid #1e3a52",
                    paddingTop: "12px",
                    paddingBottom: "10px",
                    background:
                        "linear-gradient(180deg, #0d1f2d 0%, #0a1929 100%)",
                }}
            >
                <h2
                    style={{
                        fontSize: responsive.font,
                        margin: 0,
                        textAlign: "center",
                        fontWeight: 650,
                        letterSpacing: "0.3px",
                        padding: "0 8px",
                    }}
                >
                    {post.titolo}
                </h2>

                <span
                    style={{
                        fontSize: "0.84rem",
                        color: "#64b5f6",
                        marginTop: "6px",
                        fontWeight: 500,
                    }}
                >
                    {new Date(post.dataEvento).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}{" "}
                    • {post.oraEvento}
                </span>
            </div>

            {/* Locandina */}
            <div
                style={{
                    width: "100%",
                    height: `${responsive.posterHeight}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    backgroundColor: "#0d1c2f",
                }}
            >
                <img
                    src={post.locandina}
                    alt={post.titolo}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </div>

            {/* Corpo testo */}
            <div
                style={{
                    padding: responsive.padding,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: "7px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: 500,
                        fontSize: "0.88rem",
                        lineHeight: "1.45",
                        color: "#e3f2fd",
                        overflowWrap: "break-word",
                    }}
                >
                    {post.descrizione}
                </p>

                <p
                    style={{
                        margin: 0,
                        color: "#42a5f5",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                    onClick={() => onShowOnMap?.(post.location?.coordinates)}
                >
                    <span style={{ fontSize: "0.95rem" }}>📍</span>
                    {post.location?.address || "Luogo non disponibile"}
                </p>

                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500 }}>
                    <span style={{ fontSize: "0.95rem" }}>💶</span>{" "}
                    {post.prezzo === 0 ? "Gratis" : `€${post.prezzo}`}
                </p>

                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500 }}>
                    <span style={{ fontSize: "0.95rem" }}>🎟️</span>{" "}
                    {post.bigliettiDisponibili === 0
                        ? "Sold Out"
                        : `${post.bigliettiDisponibili} disponibili`}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "10px",
                        borderTop: "1px solid #1e3a52",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontStyle: "italic",
                            color: "#90caf9",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                        }}
                    >
                        <span style={{ fontSize: "0.95rem" }}>👤</span>{" "}
                        {post.organizzatore?._id === user?._id ? user.username : post.organizzatore?.username}
                    </p>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {renderFooter()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
