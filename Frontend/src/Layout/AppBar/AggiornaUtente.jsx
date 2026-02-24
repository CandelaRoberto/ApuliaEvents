import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../Auth/Slice/authSlice";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert } from "@mui/material";
import { RotatingLines } from 'react-loader-spinner';

export default function ModaleModificaProfilo({ open, onClose }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [updateError, setUpdateError] = useState("");


    useEffect(() => {
    if (open) {
      setErrors({}); 
      setUpdateError("");
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      setForm({
        nome: user.nome || "",
        cognome: user.cognome || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user, open]);

  const validate = () => {
    let ok = true;
    const e = {};

    ["nome", "cognome", "username", "email"].forEach((key) => {
      if (!form[key].trim()) {
        e[key] = "Campo obbligatorio";
        ok = false;
      }
    });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.email.trim() !== "" && !emailRegex.test(form.email)) {
    e.email = "Inserisci un'email valida";
    ok = false;
  }
     
    if (form.password.trim() !== "" && form.password.length < 6) {
     e.password = "La password deve contenere almeno 6 caratteri";
     ok = false;
    }
    setErrors(e);
    return ok;
  };

    const handleUpdate = async () => {
    if (!validate()) return;

    const body = {};
    if (form.nome !== user.nome) body.nome = form.nome;
    if (form.cognome !== user.cognome) body.cognome = form.cognome;
    if (form.username !== user.username) body.username = form.username;
    if (form.email !== user.email) body.email = form.email;
    if (form.password.trim() !== "") body.password = form.password;

    setLoading(true);

    try {
      const res = await fetch(`https://apuliaeventsbackend.onrender.com/api/user/aggiornaUtente/${user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Errore update");

      const updatedUser = await res.json();
      dispatch(loginUser({ user: updatedUser, token }));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));
      onClose();
    } catch (err) {
      console.error(err);
      setUpdateError("Username o email già in uso");
    }finally {
      setLoading(false);
    }

  };

  return (
    <Modal open={open} onClose={onClose}   BackdropProps={{sx: {backdropFilter: "blur(6px)",backgroundColor: "rgba(0,0,0,0.4)"}}}>
      <Box sx={{ backgroundColor: "#001126", p: 3, borderRadius: 2, width: 400, mx: "auto", mt: "10vh", "& *": {fontFamily: "'Rische', sans-serif !important"} }}>
        <Typography variant="h6" mb={2} sx={{color:"white"}}>
          Modifica profilo
        </Typography>
   
    {updateError && (
      <Alert
        severity="error"
        sx={{
          marginBottom: 2,
          backgroundColor: "transparent",
          color: "#ff6b6b",
          "& .MuiAlert-icon": { color: "#ff6b6b" },
          "& .MuiAlert-message": { fontFamily: "'Rische', serif" },
          fontFamily: "'Rische', serif",
        }}
      >
        {updateError}
      </Alert>
    )}

        <Typography sx={{ color: "white", mb: 0.5 }}>Nome: </Typography>
        <TextField 
          fullWidth sx={{ mb: 1,  "& .MuiInputBase-root": {backgroundColor:"#fff", } }}
          value={form.nome}
          onChange={(e) => {
            setForm({ ...form, nome: e.target.value });
            setErrors(prev => ({ ...prev, nome: "" }));

          }}
          error={!!errors.nome}
          helperText={errors.nome}

        />
        <Typography sx={{ color: "white", mb: 0.5 }}>Cognome: </Typography>
        <TextField 
          fullWidth sx={{ mb: 1, "& .MuiInputBase-root": {backgroundColor:"#fff"} }}
          value={form.cognome}
          onChange={(e) =>{
             setForm({ ...form, cognome: e.target.value });
             setErrors(prev => ({ ...prev, cognome: "" }));
             }}
          error={!!errors.cognome}
          helperText={errors.cognome}
        />
        <Typography sx={{ color: "white", mb: 0.5 }}>Username: </Typography>
        <TextField 
          fullWidth  sx={{ mb: 1, "& .MuiInputBase-root": {backgroundColor:"#fff"} }}
          value={form.username}
          onChange={(e) => {
            setForm({ ...form, username: e.target.value });
            setErrors(prev => ({ ...prev, username: "" }));
          }}
          error={!!errors.username}
          helperText={errors.username}
          inputProps={{maxLength:20}}
        />
        <Typography sx={{ color: "white", mb: 0.5 }}>Email: </Typography>
        <TextField 
          fullWidth  sx={{ mb: 1, "& .MuiInputBase-root": {backgroundColor:"#fff"}}}
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors(prev => ({ ...prev, email: "" }));
          }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Typography sx={{ color: "white", mb: 0.5 }}>Nuova password: </Typography>
        <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              sx={{ mb: 2, "& .MuiInputBase-root": {backgroundColor:"#fff"}}}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setErrors(prev => ({ ...prev, password: "" }));
              }}
               error={!!errors.password}
               helperText={errors.password}
            />
            <Box
            onClick={() => setShowPassword(!showPassword)}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#444"
            }}
             >
            {showPassword ? <VisibilityOff /> : <Visibility />}
            </Box>
        </Box>

        <Button 
        variant="contained"
        fullWidth 
        onClick={handleUpdate}
        disabled={loading}
         sx={{
                mt: 2,
                backgroundColor: "#FF7A2E",
                color: "#fff",
                fontFamily: "'Rische', sans-serif",
                fontWeight: 600,
                "&:hover": {
                            backgroundColor: "#e66a1e",
                            },
             }}>
              {loading ? (
                <RotatingLines
                  visible
                  height="24"
                  width="24"
                  color="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                />
              ) : (
                "Aggiorna"
              )}
        </Button>
      </Box>
    </Modal>
  );
}
