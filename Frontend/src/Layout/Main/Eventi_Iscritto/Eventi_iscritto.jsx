import { useSelector } from "react-redux";
import {useCarousel} from "../../../Hooks/useCarusel_e_Frecce";
import PostCard from "../../../Components/Postcard";
import "../../../Components/Frecce.css";

const EventiIscritto = ({posts,setPosts,setUtenteSelezionato,setUtenteSelezionatoOggetto,setActiveContent,onShowOnMap,}) => {
    const { user } = useSelector((state) => state.auth);
    const mieiEventi = posts.filter((p) =>
        Array.isArray(p.partecipanti)
            ? p.partecipanti.some((x) => (typeof x === "string" ? x === user?._id : x?._id === user?._id))
            : false
        );
    const haEventi = mieiEventi.length > 3;
    const {scrollRef,canLeft,canRight,showArrows,responsive,scrollLeft,scrollRight} = useCarousel(mieiEventi);   
    
    const handleDisiscrizione = async (postId) => {
        try {
            await fetch(`https://apuliaeventsbackend.onrender.com/api/post/posts/${postId}/rinuncia`, {
                method: "POST",
                credentials: "include",
            });

            setPosts((prev) =>
                prev.map((p) => {
                    if (p._id !== postId) return p;
                    const nuovaLista = (p.partecipanti || []).filter((uid) =>
                        typeof uid === "string" ? uid !== user._id : uid?._id !== user._id
                    );
                    return {
                        ...p,
                        partecipanti: nuovaLista,
                        bigliettiDisponibili: (p.bigliettiDisponibili || 0) + 1,
                    };
                })
            );
        } catch (err) {
            console.error("Errore disiscrizione:", err);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "calc(100vh - 90px)",
                marginTop: "90px",
                background: "transparent",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            {haEventi && showArrows && (
                <>
                    <button
                        className="scrollArrowBtn"
                        disabled={!canLeft}
                        style={{
                            left: "10px",
                            zIndex: 2,
                        }}
                         onClick={scrollLeft}

                    >
                        ‹
                    </button>
                    <button
                        className="scrollArrowBtn"
                        disabled={!canRight}
                        style={{
                            right: "10px",
                            zIndex: 2,
                        }}
                        onClick={scrollRight}
                    >
                        ›
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                style={{
                    width: "100%",
                    display: "flex",
                    gap: `${responsive.gap}px`,
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    justifyContent: mieiEventi.length === 0 ? "center" : "flex-start",
                    scrollSnapType: "x mandatory",
                    padding: "20px 30px 40px 30px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                className="hide-scrollbar"
            >
                {mieiEventi.length === 0 ? (
                    <p
                        style={{
                            color: "#e3f2fd",
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontFamily: "'Rische', sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        Non sei iscritto a nessun evento!
                    </p>
                ) : (
                    mieiEventi.map((post) =>(
                        <PostCard
                            key={post._id}
                            post={post}
                            user={post.organizzatore}
                            responsive={responsive}
                            footerType="joined"
                            onShowOnMap={onShowOnMap}
                            onUnsubscribe={() => handleDisiscrizione(post._id)}
                            onChat={() => {
                                setUtenteSelezionato(post.organizzatore?._id);
                                setUtenteSelezionatoOggetto(post.organizzatore);
                                setActiveContent("chat");
                                 }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default EventiIscritto;
