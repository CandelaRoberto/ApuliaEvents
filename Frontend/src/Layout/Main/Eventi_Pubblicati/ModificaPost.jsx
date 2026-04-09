import { Modal, Box, TextField, Button,Typography } from "@mui/material";
import {customInputStyle,multilineInputStyle} from "../HomePage/Crea_Evento";
import { RotatingLines } from "react-loader-spinner";
const today = new Date().toISOString().split("T")[0];

export const ModificaPost = ({open,onClose,formData,errors,setField,handleAddressChange,handleSave,luogoInputRef,loading}) => {
    return (
            <Modal open={open} onClose={onClose}  BackdropProps={{style: {backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'}
    }}>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSave}
                    sx={{
                        background: "#001126",
                        borderRadius: 2,
                        p: 3,
                        width: {xs: "92%", sm: "420px", md: "500px", lg: "520px"},
                        maxHeight: "90vh",
                        overflowY: "auto",
                        mx: "auto",
                        mt: "10vh",
                        boxShadow: 24,
                        fontFamily: "'Rische', sans-serif",
                    }}
                >
                    <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif",}}>Titolo: </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        value={formData.titolo}
                        onChange={(e) => setField("titolo", e.target.value)}
                        error={!!errors.titolo}
                        helperText={errors.titolo}
                        inputProps={{ maxLength: 30, minLength:3}}
                        sx={customInputStyle}
                    />
                    <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif",mt:2 }}>Descrizione: </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        multiline
                        minRows={2}
                        value={formData.descrizione}
                        onChange={(e) => setField("descrizione", e.target.value)}
                        error={!!errors.descrizione}
                        helperText={errors.descrizione}
                        inputProps={{ maxLength: 70,minLength:10}}
                        sx={multilineInputStyle}
                    />
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt:2 }}>
                      <Box>
                        <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif", }}>Data: </Typography>
                        <TextField
                            type="date"
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dataEvento}
                            onChange={(e) => setField("dataEvento", e.target.value)}
                            error={!!errors.dataEvento}
                            helperText={errors.dataEvento}
                            inputProps={{ min: today }}
                            sx={customInputStyle}
                        />
                      </Box>
                        <Box>
                        <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif", }}>Ora: </Typography>
                        <TextField
                            type="time"
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            value={formData.oraEvento}
                            onChange={(e) => setField("oraEvento", e.target.value)}
                            error={!!errors.oraEvento}
                            helperText={errors.oraEvento}
                            sx={customInputStyle}
                        />
                    </Box>
                    </Box>
                    <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif",mt:2 }}>Indirizzo: </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        inputRef={luogoInputRef}
                        value={formData.indirizzo}
                        onChange={handleAddressChange}
                        placeholder="Es. Via Roma 10, Bari"
                        error={!!errors.indirizzo}
                        helperText={errors.indirizzo}
                        sx={customInputStyle}
                    />

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,mt:2}}>
                      <Box>
                        <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif", }}>Prezzo: </Typography>
                        <TextField
                            type="number"
                            margin="dense"
                            value={formData.prezzo}
                            onChange={(e) => setField("prezzo", e.target.value)}
                            error={!!errors.prezzo}
                            helperText={errors.prezzo}
                            sx={customInputStyle}
                        />
                        </Box>
                        <Box>
                        <Typography sx={{ color: "white", fontFamily: "'Rische', sans-serif", }}>Biglietti Totali: </Typography>
                        <TextField
                            type="number"
                            margin="dense"
                            value={formData.bigliettiTotali}
                            onChange={(e) => setField("bigliettiTotali", e.target.value)}
                            error={!!errors.bigliettiTotali}
                            helperText={errors.bigliettiTotali}
                            sx={customInputStyle}
                        />
                    </Box>
                    </Box>
                    <Box mt={2}>
                        <div style={{ fontSize: 13, marginBottom: 4, color: "#fff" }}>
                            Nuova Locandina (opzionale)
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setField("locandina", e.target.files?.[0] || null)}
                            style={{
                                color: "#fff",
                                fontFamily: "'Rische', sans-serif",
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        disabled={loading} 
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: "#FF7A2E",
                            color: "#fff",
                            fontFamily: "'Rische', sans-serif",
                            fontWeight: 600,
                            "&:hover": {
                                backgroundColor: "#e66a1e",
                            },
                        }}
                    >
                        {loading ? (
                            <RotatingLines
                                visible
                                height="24"
                                width="24"
                                color="white"
                                strokeWidth="5"
                                animationDuration="0.5"
                            />
                        ) : (
                            "SALVA"
                        )}   
                 </Button>
                </Box>
            </Modal>
    );
};
