import PostCard from "../../../Components/Postcard";
import { EliminaPost } from "./EliminaPost";
import { ModificaPost } from "./ModificaPost";
import { UtentiIscritti } from "./UtentiIscritti";
import {Snackbar,Alert,} from "@mui/material";
import { useSelector } from "react-redux";
import "../../../Components/Frecce.css";
import {useCarousel} from "../../../Hooks/useCarusel_e_Frecce";
import {useModificaPost} from "../../../Hooks/useModificaPost";
import {useEliminaPost} from "../../../Hooks/useEliminaPost";
import {useIscritti} from "../../../Hooks/useIscritti";

const ListaPostPersonali = ({ posts, setPosts, onShowOnMap }) => {
    const { user } = useSelector((state) => state.auth);
    const mieiPosts = posts.filter((p) => p.organizzatore?._id === user?._id);
    const haEventi = mieiPosts.length > 3;
    const {scrollRef,canLeft,canRight,showArrows,responsive,scrollLeft,scrollRight} = useCarousel(mieiPosts);
    const {openModal,handleOpenEdit,handleCloseModal,handleSave,formData,setField,errors,snackbarOpen,setSnackbarOpen,handleAddressChange,luogoInputRef,loading} = useModificaPost((nuoviPost) => setPosts(nuoviPost));
    const {openDeleteDialog,setOpenDeleteDialog,setPostToDelete,handleConfirmDelete} = useEliminaPost(setPosts);
    const {open: openIscritti,lista: listaIscritti,openIscritti: openIscrittiModal,closeIscritti: closeIscrittiModal} = useIscritti();
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
            {/* Frecce */}
            {haEventi && showArrows && (
                <>
                    <button
                        className="scrollArrowBtn"
                        disabled={!canLeft}
                        style={{left: "10px",zIndex: 2,}}
                        onClick={scrollLeft}
                    >
                        ‹
                    </button>
                    <button
                        className="scrollArrowBtn"
                        disabled={!canRight}
                        style={{right: "10px", zIndex: 2,}}
                        onClick={scrollRight}
                    >
                        ›
                    </button>
                </>
            )}

            {/* Carosello */}
            <div
                ref={scrollRef}
                style={{
                    width: "100%",
                    display: "flex",
                    gap: responsive.gap,
                    overflowX: "auto",
                    scrollBehavior: "smooth",       
                    justifyContent: mieiPosts.length === 0 ? "center" : "flex-start",
                    scrollSnapType: "x mandatory",
                    padding: "20px 30px 40px 30px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                className="hide-scrollbar"
            >
                {mieiPosts.length === 0 ? (
                    <p
                        style={{
                            color: "#e3f2fd",
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontFamily: "'Rische', sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        Nessun evento pubblicato!
                    </p>
                ):(
                    mieiPosts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                user={user}
                                responsive={responsive}
                                footerType="owned"   
                                onShowOnMap={onShowOnMap}
                                onEdit={() => handleOpenEdit(post)}
                                onDelete={() => {
                                    setPostToDelete(post);
                                    setOpenDeleteDialog(true);
                                }}
                                onShowIscritti={() => openIscrittiModal(post)}
                            />
                        ))
                    )}
            </div>
            <UtentiIscritti
                open={openIscritti}
                onClose={closeIscrittiModal}
                lista={listaIscritti}
            />
            <ModificaPost
                open={openModal}
                onClose={handleCloseModal}
                formData={formData}
                errors={errors}
                setField={setField}
                handleAddressChange={handleAddressChange}
                handleSave={handleSave}
                luogoInputRef={luogoInputRef}
                loading={loading}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2300}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: "100%" }}
                >
                    Operazione completata!
                </Alert>
            </Snackbar>
            <EliminaPost
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default ListaPostPersonali;
