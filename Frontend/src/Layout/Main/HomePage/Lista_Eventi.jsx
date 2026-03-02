import { useSelector } from "react-redux";
import PostCard from "../../../Components/Postcard";
import {useCarousel} from "../../../Hooks/useCarusel_e_Frecce";
import "../../../Components/Frecce.css";

const ListaPost = ({
                       posts,
                       setUtenteSelezionato,
                       setUtenteSelezionatoOggetto,
                       setActiveContent,
                       onShowOnMap,
                       onPartecipa,
                   }) => {
    const { user } = useSelector((state) => state.auth);
    const {scrollRef,canLeft,canRight,showArrows,responsive,scrollLeft,scrollRight} = useCarousel(posts);
    const haEventi = posts.length > 3;

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
                    justifyContent: posts.length === 0 ? "center" : "flex-start",
                    scrollSnapType: "x mandatory",
                    padding: "20px 30px 40px 30px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                className="hide-scrollbar"
            >
                {posts.length === 0 ? (
                    <p
                        style={{
                            color: "#e3f2fd",
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontFamily: "'Rische', sans-serif",
                            fontWeight: 500,
                        }}
                    >
                       Non ci sono eventi pubblicati al momento!
                    </p>
                ):(
                    posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                user={user}
                                responsive={responsive}
                                footerType="public"   
                                onShowOnMap={onShowOnMap}
                                onPartecipa={() => onPartecipa(post._id)}
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

export default ListaPost;
