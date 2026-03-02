import { useState, useRef, useEffect } from "react";

export function useModificaPost(onUpdatedPosts) {

    const [openModal, setOpenModal] = useState(false);
    const [postDaModificare, setPostDaModificare] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    
    const [formData, setFormData] = useState({
        titolo: "",
        descrizione: "",
        dataEvento: "",
        oraEvento: "",
        prezzo: "",
        bigliettiTotali: "",
        locandina: null,
        indirizzo: "",
        location: { address: "", coordinates: { lat: "", lng: "" } },
    });

    const luogoInputRef = useRef(null);
    const autocompleteRef = useRef(null);

    const setFieldError = (name, message) =>
        setErrors(prev => ({ ...prev, [name]: message }));

    const clearFieldError = (name) =>
        setErrors(prev => {
            const r = { ...prev };
            delete r[name];
            return r;
        });

    const validateField = (name, value) => {
        if (["titolo", "descrizione", "dataEvento", "oraEvento", "indirizzo"].includes(name)) {
            if (!value?.trim()) {
                setFieldError(name, "Campo obbligatorio");
                return false;
            }
            clearFieldError(name);
            return true;
        }

        if (name === "prezzo") {
            if (value === "" || value === null) {
                setFieldError(name, "Campo obbligatorio");
                return false;
            }
            const v = +value;
            if (isNaN(v) || v < 0) {
                setFieldError(name, "Prezzo non valido");
                return false;
            }
            clearFieldError(name);
            return true;
        }

        if (name === "bigliettiTotali") {
            if (value === "" || value === null) {
                setFieldError(name, "Campo obbligatorio");
                return false;
            } 
            const v = +value;
            const iscritti = postDaModificare?.partecipanti?.length || 0;

            if (isNaN(v) || !Number.isInteger(v)) {
                setFieldError(name, "N° non valido");
                return false;
            }
            if (v < iscritti) {
                setFieldError(name, `Non puoi mettere meno di ${iscritti}`);
                return false;
            }
            clearFieldError(name);
            return true;
        }

        if (name === "location") {
            if (!formData.location.coordinates.lat) {
                setFieldError("indirizzo", "Seleziona un indirizzo dalla lista");
                return false;
            }
            clearFieldError("indirizzo");
            return true;
        }

        return true;
    };

    const validateAll = () => {
        return [
            validateField("titolo", formData.titolo),
            validateField("descrizione", formData.descrizione),
            validateField("dataEvento", formData.dataEvento),
            validateField("oraEvento", formData.oraEvento),
            validateField("indirizzo", formData.indirizzo),
            validateField("prezzo", formData.prezzo),
            validateField("bigliettiTotali", formData.bigliettiTotali),
            validateField("location", formData.location),
        ].every(Boolean);
    };

    // Maps 
    useEffect(() => {
        if (!openModal) return;

        const timer = setTimeout(() => {
            if (window.google?.maps?.places && luogoInputRef.current && !autocompleteRef.current) {
                autocompleteRef.current = new window.google.maps.places.Autocomplete(
                    luogoInputRef.current,
                    {
                        componentRestrictions: { country: "it" },
                        fields: ["formatted_address", "geometry"],
                    }
                );

                autocompleteRef.current.addListener("place_changed", () => {
                    const place = autocompleteRef.current.getPlace();
                    if (!place?.geometry) return;

                    const address = place.formatted_address;
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    setFormData(prev => ({
                        ...prev,
                        indirizzo: address,
                        location: { address, coordinates: { lat, lng } },
                    }));

                    clearFieldError("indirizzo");
                });
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [openModal]);

    //HANDLER 
    const handleCloseModal = () => {
        setOpenModal(false);
        autocompleteRef.current = null;
    };

    const handleOpenEdit = (post) => {
        const address = post.location?.address || "";
        const lat = post.location?.coordinates?.lat ?? "";
        const lng = post.location?.coordinates?.lng ?? "";

        setPostDaModificare(post);

        setFormData({
            titolo: post.titolo,
            descrizione: post.descrizione,
            dataEvento: post.dataEvento.split("T")[0],
            oraEvento: post.oraEvento,
            prezzo: post.prezzo,
            bigliettiTotali: post.bigliettiTotali,
            locandina: null,
            indirizzo: address,
            location: { address, coordinates: { lat, lng } },
        });

        setErrors({});
        setOpenModal(true);
    };

    const setField = (name, val) => {
        setFormData(prev => ({ ...prev, [name]: val }));
        validateField(name, val);
    };

    const handleAddressChange = (e) => {
        const v = e.target.value;

        setFormData(prev => ({
            ...prev,
            indirizzo: v,
            location: { ...prev.location, address: v, coordinates: { lat: "", lng: "" } },
        }));

        setFieldError("indirizzo", "Seleziona un indirizzo dalla lista");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!postDaModificare) return;
        let newErrors = {};

    const today = new Date().toISOString().split("T")[0];

    if (!formData.dataEvento || formData.dataEvento < today) {
        newErrors.dataEvento = "Data non valida";
    }
      if (!formData.titolo || formData.titolo.trim().length < 3) {
        newErrors.titolo = "Minimo 3 caratteri";
    }
    if (formData.titolo.trim().length > 30) {
        newErrors.titolo = "Massimo 30 caratteri";
    }

    if (!formData.descrizione || formData.descrizione.trim().length < 10) {
        newErrors.descrizione = "Minimo 10 caratteri";
    }
    if (formData.descrizione.trim().length > 70) {
        newErrors.descrizione = "Massimo 70 caratteri";
    }
        if (!validateAll()){
        setErrors(prev => ({ ...prev, ...newErrors }));
        return;
    };
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newErrors }));
        return;
    }

    setLoading(true);

        try {
            const fd = new FormData();
            fd.append("titolo", formData.titolo);
            fd.append("descrizione", formData.descrizione);
            fd.append("dataEvento", formData.dataEvento);
            fd.append("oraEvento", formData.oraEvento);
            fd.append("prezzo", String(formData.prezzo));
            fd.append("bigliettiTotali", String(formData.bigliettiTotali));
            fd.append("location", JSON.stringify(formData.location));

            if (formData.locandina) {
                fd.append("locandina", formData.locandina);
            }

            await fetch(
                `https://apuliaeventsbackend.onrender.com/api/post/posts/${postDaModificare._id}`,
                { method: "PUT", body: fd, credentials: "include" }
            );

            const res2 = await fetch("https://apuliaeventsbackend.onrender.com/api/post/posts", {
                credentials: "include",
            });

            const all = await res2.json();
            const sorted = all.sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento));

            onUpdatedPosts(sorted);

            setSnackbarOpen(true);
            setOpenModal(false);
            setPostDaModificare(null);
            autocompleteRef.current = null;

        } catch (err) {
            console.error(err);
        }finally {
        setLoading(false); 
     }
    };

    return {
        openModal,
        handleOpenEdit,
        handleCloseModal,
        handleSave,
        formData,
        setField,
        errors,
        snackbarOpen,
        setSnackbarOpen,
        handleAddressChange,
        luogoInputRef,
        loading,
    };
}
