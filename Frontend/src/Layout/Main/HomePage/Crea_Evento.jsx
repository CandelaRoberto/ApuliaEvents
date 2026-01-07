import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Typography, TextField, Grid, Stack } from "@mui/material";
import { Formik, Form } from "formik"; 
import * as Yup from "yup";
import { RotatingLines } from "react-loader-spinner";

export const customInputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    height: "40px",
    "& fieldset": { border: "none" },
    "& input": { padding: "10px 12px", color: "#000", fontFamily: "'Rische', sans-serif" },
    "&.Mui-error fieldset": { border: "none" },
  },
  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: "-18px",
    left: "0px",
    fontWeight: "bold",
    fontSize: "0.70rem",
    color: "#ff3333 !important",
    margin: 0,
    fontFamily: "'Rische', sans-serif",
    whiteSpace: "nowrap", //mette l'errore tutto su una riga, serve per il campo dell'ora
    zIndex: 1,
  }
};

export const multilineInputStyle = {
  ...customInputStyle,
  "& .MuiOutlinedInput-root": {
    ...customInputStyle["& .MuiOutlinedInput-root"],
    height: "auto",
    minHeight: "80px",
    "& fieldset": { border: "none" },
    padding: "10px",
    backgroundColor: "#fff",
    fontFamily: "'Rische', sans-serif",
  }
};

const labelStyle = {
  color: "white",
  fontSize: "0.85rem",
  fontWeight: "600",
  marginBottom: "4px",
  fontFamily: "'Rische', sans-serif",
};

const preventInvalidInput = (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};

const Post = ({ onPostCreated }) => {
  const [message, setMessage] = useState("");
  
  const luogoInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const setFieldValueRef = useRef(null); 
  
  const validationSchema = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Yup.object({
      titolo: Yup.string().max(30, "Massimo 30 caratteri").min(3,"Minimo 3 caratteri").required("Campo obbligatorio"),
      descrizione: Yup.string().max(70, "Massimo 70 caratteri").min(10,"Minimo 10 caratteri").required("Campo obbligatorio"),
      dataEvento: Yup.date().min(today, "Inserisci una data valida").required("Campo obbligatorio"),
      oraEvento: Yup.string().required("Campo obbligatorio"),
      luogo: Yup.string().required("Campo obbligatorio"),
      prezzo: Yup.number().min(0, "Il prezzo non può essere negativo").required("Campo obbligatorio"),
      bigliettiTotali: Yup.number().min(1, "Minimo 1 biglietto").integer("Solo numeri interi").required("Campo obbligatorio"),
    });
  }, []);

  const initialValues = useMemo(() => ({
    titolo: "",
    descrizione: "",
    dataEvento: "",
    oraEvento: "",
    luogo: "",
    lat: "",
    lng: "",
    prezzo: 0,
    bigliettiTotali: 1,
    locandina: null,
  }), []);

  useEffect(() => {
    if (!window.google?.maps?.places) return;
    if (!luogoInputRef.current) return;
    if (autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(luogoInputRef.current, {
      componentRestrictions: { country: "it" },
      fields: ["formatted_address", "geometry"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) return;

      if (setFieldValueRef.current) {
        setFieldValueRef.current("luogo", place.formatted_address);
        setFieldValueRef.current("lat", place.geometry.location.lat());
        setFieldValueRef.current("lng", place.geometry.location.lng());
      }
    });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#001126",
        color: "white",
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        fontFamily: "'Rische', sans-serif",
        maxWidth: "500px",
        width: { xs: "95%", sm: "100%" },
        mx: "auto",
        maxHeight: "93vh",
        overflowY: "auto",
      }}
    >

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={true} 
        validateOnBlur={false}  
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setMessage("");
          try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
              if (value === "") return;
              formData.append(key, value);
            });

            const res = await fetch("http://localhost:5001/api/post/pubblicaPost", {
              method: "POST",
              body: formData,
              credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Errore creazione post");

            setMessage("✅ Post creato con successo!");
            if (onPostCreated) onPostCreated();
            resetForm();
          } catch (err) {
            console.error(err);
            setMessage("❌ " + err.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values, handleChange, errors, touched }) => {
          
             if (setFieldValueRef.current !== setFieldValue) {
             setFieldValueRef.current = setFieldValue;
          }

          return (
            <Form noValidate>
              <Stack spacing={2}>
                
                <Box sx={{ position: "relative" }}>
                  <Typography sx={labelStyle}>Titolo:</Typography>
                  <TextField
                    fullWidth
                    name="titolo"
                    placeholder="Titolo Evento..."
                    variant="outlined"
                    sx={customInputStyle}
                    inputProps={{ maxLength: 30, minLength:3}}
                    value={values.titolo}
                    onChange={handleChange}
                    error={touched.titolo && Boolean(errors.titolo)}
                    helperText={touched.titolo && errors.titolo}
                  />
                </Box>

                <Box sx={{ position: "relative" }}>
                  <Typography sx={labelStyle}>Descrizione:</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="descrizione"
                    placeholder="Descrivi l'evento..."
                    variant="outlined"
                    sx={multilineInputStyle}
                    inputProps={{ maxLength: 70, minLength:10}}
                    value={values.descrizione}
                    onChange={handleChange}
                    error={touched.descrizione && Boolean(errors.descrizione)}
                    helperText={touched.descrizione && errors.descrizione}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ position: "relative" }}>
                    <Typography sx={labelStyle}>Data:</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      name="dataEvento"
                      sx={customInputStyle}
                      inputProps={{ min: new Date().toISOString().split("T")[0] }}
                      value={values.dataEvento}
                      onChange={handleChange}
                      error={touched.dataEvento && Boolean(errors.dataEvento)}
                      helperText={touched.dataEvento && errors.dataEvento}
                    />
                  </Grid>
                  <Grid item xs={6} sx={{ position: "relative" }}>
                    <Typography sx={labelStyle}>Ora:</Typography>
                    <TextField
                      fullWidth
                      type="time"
                      name="oraEvento"
                      sx={customInputStyle}
                      value={values.oraEvento}
                      onChange={handleChange}
                      error={touched.oraEvento && Boolean(errors.oraEvento)}
                      helperText={touched.oraEvento && errors.oraEvento}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ position: "relative" }}>
                  <Typography sx={labelStyle}>Indirizzo:</Typography>
                  <TextField
                    fullWidth
                    placeholder="Cerca indirizzo..."
                    variant="outlined"
                    inputRef={luogoInputRef}
                    onChange={(e) => setFieldValue("luogo", e.target.value)}
                    sx={customInputStyle}
                    defaultValue={initialValues.luogo} 
                    error={touched.luogo && Boolean(errors.luogo)}
                    helperText={touched.luogo && errors.luogo}
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1, position: "relative" }}>
                    <Typography sx={labelStyle}>Prezzo:</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="prezzo"
                      placeholder="0"
                      inputProps={{ min: 0 }}
                      onKeyDown={preventInvalidInput}
                      sx={customInputStyle}
                      value={values.prezzo}
                      onChange={handleChange}
                      error={touched.prezzo && Boolean(errors.prezzo)}
                      helperText={touched.prezzo && errors.prezzo}
                    />
                  </Box>
                  <Box sx={{ flex: 1, position: "relative" }}>
                    <Typography sx={labelStyle}>Biglietti Totali:</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      name="bigliettiTotali"
                      placeholder="100"
                      inputProps={{ min: 1 }}
                      onKeyDown={preventInvalidInput}
                      sx={customInputStyle}
                      value={values.bigliettiTotali}
                      onChange={handleChange}
                      error={touched.bigliettiTotali && Boolean(errors.bigliettiTotali)}
                      helperText={touched.bigliettiTotali && errors.bigliettiTotali}
                    />
                  </Box>
                </Stack>

                <Box>
                  <Typography sx={labelStyle}>Locandina</Typography>
                  <Box sx={{ mt: 0.5, p: 1, border: "1px dashed rgba(255,255,255,0.3)", borderRadius: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFieldValue("locandina", e.currentTarget.files[0])}
                      style={{ color: 'white', fontSize: '14px', width: '100%', fontFamily: 'inherit' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 2, pb: 2 }}>
                  {!isSubmitting ? (
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        mt: 2,
                        backgroundColor: "#FF7A2E",
                        color: "white",
                        fontWeight: "600",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        fontFamily: "inherit",
                        '&:hover': { backgroundColor: "#e66a1e" }
                      }}
                    >
                      PUBBLICA EVENTO
                    </Button>
                  ) : (
                    <Box display="flex" justifyContent="center" mt={2}>
                      <RotatingLines visible height="35" width="96" color="white" strokeWidth="5" animationDuration="0.5" />
                    </Box>
                  )}
                </Box>

                {message && (
                  <Typography align="center" sx={{ color: message.includes("successo") ? "#4caf50" : "#f44336", mt: 1 }}>
                    {message}
                  </Typography>
                )}

              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Post;