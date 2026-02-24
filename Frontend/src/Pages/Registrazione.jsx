import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registrazioneUser } from '../Auth/Slice/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {colors,GlobalStyle,Title,FormWrapper,TextLink} from "../Components/styles";
import {RegistrationContainer,FormGroup,PhotoSection,FormSectionReg,InputContainerReg,RadioContainer,RadioLabel,StyledForm,InputIconReg,InputReg,ErrorMessageReg,SubmitButtonReg,SubtitleReg} from '../Components/RegistrazioneStyles';

const validationSchema = Yup.object({
    nome: Yup.string().required('Nome obbligatorio'),
    cognome: Yup.string().required('Cognome obbligatorio'),
    username: Yup.string().max(20, 'Massimo 20 caratteri').required('Username obbligatorio'),
    email: Yup.string().email('Email non valida').required('Email obbligatoria'),
    password: Yup.string()
        .min(8, 'Password minimo 8 caratteri')
        .max(30, 'Password troppo lunga')
        .required('Password obbligatoria'),
    confermapassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Le password non corrispondono')
        .required('Conferma password obbligatoria'),
    ruolo: Yup.string().oneOf(['Utente', 'Organizzatore']).required('Seleziona un ruolo'),
});

const Registrazione = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            nome: '',
            cognome: '',
            username: '',
            email: '',
            password: '',
            confermapassword: '',
            ruolo: 'Utente',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLocalError(null);
            setLoading(true);
            try {
                const res = await fetch('https://apuliaeventsbackend.onrender.com/api/user/registrazione', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) {
                    setLocalError(data.message || 'Errore durante la registrazione');
                    setLoading(false);
                    return;
                }

                dispatch(registrazioneUser({
                    user: data,
                    token: data.token,
                }));

                navigate('/Dashboard');
            } catch (err) {
                const errorMessage = err.message || 'Errore durante la registrazione';
                setLocalError(errorMessage);
                console.error('Errore registrazione:', err);
                setLoading(false);
            }
        },
    });

    return (
        <>
            <style>{GlobalStyle}</style>

            <RegistrationContainer>
                <FormWrapper>
                    <PhotoSection $bgImage={require('../Assets/sfondoRegistrazione.jpg')} />

                    <FormSectionReg>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <img
                                src={require('../Assets/Logo.png')}
                                alt="Logo"
                                style={{ height: '100px', width: 'auto' }}
                            />
                            <h2 style={{
                                color: colors.white,
                                fontSize: '28px',
                                fontWeight: 580,
                                margin: 0,
                                padding: 0,
                                letterSpacing: '1px',
                                fontFamily: "'Rische', serif"
                            }}>
                                ApuliaEvents
                            </h2>
                        </div>

                        <Title>Crea il tuo account</Title>

                        <SubtitleReg>
                            Hai già un account?{' '}
                            <TextLink onClick={() => navigate('/')}>
                                Accedi qui
                            </TextLink>
                        </SubtitleReg>

                        {localError && (
                            <Alert severity="error" sx={{ marginBottom: 2, borderRadius: 3, fontSize: '15px',backgroundColor:"transparent", color:"#ff6b6b","& .MuiAlert-icon": { color: "#ff6b6b", },fontFamily: "'Rische', serif"}}>
                                {localError}
                            </Alert>
                        )}

                        <StyledForm onSubmit={formik.handleSubmit}>
                            {/* Nome */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>👤</InputIconReg>
                                    <InputReg
                                        type="text"
                                        name="nome"
                                        placeholder="Nome"
                                        autoComplete='new-name'
                                        value={formik.values.nome}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </InputContainerReg>
                                {formik.touched.nome && formik.errors.nome && (
                                    <ErrorMessageReg>{formik.errors.nome}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Cognome */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>👤</InputIconReg>
                                    <InputReg
                                        type="text"
                                        name="cognome"
                                        placeholder="Cognome"
                                        autoComplete='new-surname'
                                        value={formik.values.cognome}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </InputContainerReg>
                                {formik.touched.cognome && formik.errors.cognome && (
                                    <ErrorMessageReg>{formik.errors.cognome}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Username */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>👤</InputIconReg>
                                    <InputReg
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        maxLength={20 }
                                    />
                                </InputContainerReg>
                                {formik.touched.username && formik.errors.username && (
                                    <ErrorMessageReg>{formik.errors.username}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Email */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>✉️</InputIconReg>
                                    <InputReg
                                        type="email"
                                        name="email"
                                        placeholder="email@esempio.it"
                                        autoComplete='new-email'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </InputContainerReg>
                                {formik.touched.email && formik.errors.email && (
                                    <ErrorMessageReg>{formik.errors.email}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Password */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>🔒</InputIconReg>
                                    <InputReg
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: colors.white,
                                            cursor: 'pointer',
                                            opacity: 0.7,
                                            padding: 0,
                                            display: 'flex',
                                        }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </button>
                                </InputContainerReg>
                                {formik.touched.password && formik.errors.password && (
                                    <ErrorMessageReg>{formik.errors.password}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Conferma pass */}
                            <FormGroup>
                                <InputContainerReg>
                                    <InputIconReg>🔒</InputIconReg>
                                    <InputReg
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confermapassword"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={formik.values.confermapassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: colors.white,
                                            cursor: 'pointer',
                                            opacity: 0.7,
                                            padding: 0,
                                            display: 'flex',
                                        }}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </button>
                                </InputContainerReg>
                                {formik.touched.confermapassword && formik.errors.confermapassword && (
                                    <ErrorMessageReg>{formik.errors.confermapassword}</ErrorMessageReg>
                                )}
                            </FormGroup>

                            {/* Ruolo */}
                            <RadioContainer>
                                <RadioLabel>
                                    <input
                                        type="radio"
                                        name="ruolo"
                                        value="Utente"
                                        checked={formik.values.ruolo === 'Utente'}
                                        onChange={() => formik.setFieldValue('ruolo', 'Utente')}
                                    />
                                    Utente
                                </RadioLabel>
                                <RadioLabel>
                                    <input
                                        type="radio"
                                        name="ruolo"
                                        value="Organizzatore"
                                        checked={formik.values.ruolo === 'Organizzatore'}
                                        onChange={() => formik.setFieldValue('ruolo', 'Organizzatore')}
                                    />
                                    Organizzatore
                                </RadioLabel>
                            </RadioContainer>
                            {formik.touched.ruolo && formik.errors.ruolo && (
                                <ErrorMessageReg>{formik.errors.ruolo}</ErrorMessageReg>
                            )}

                            <SubmitButtonReg type="submit" disabled={loading}>
                                {loading ? (
                                    <CircularProgress size={20} sx={{ color: colors.white }} />
                                ) : (
                                    <>
                                        Registrati
                                    </>
                                )}
                            </SubmitButtonReg>
                        </StyledForm>

                    </FormSectionReg>
                </FormWrapper>
            </RegistrationContainer>
        </>
    );
};

export default Registrazione;
