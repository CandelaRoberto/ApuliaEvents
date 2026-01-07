import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Auth/Slice/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import {colors,GlobalStyle,Title,TextLink,InputIcon,FormWrapper} from "../Components/styles";
import {HeaderBar,LogoImg,BrandText,LoginContainer,FormSectionLog,IllustrationSection,ToggleIcon,FooterText,SubtitleLog,InputContainerLog,InputLog,ErrorMessageLog,SubmitButtonLog,FormGroup} from '../Components/LoginStyles';

const validationSchema = Yup.object({
    username: Yup.string().required('Username obbligatorio'),
    password: Yup.string()
        .min(6, 'Password minimo 6 caratteri')
        .required('Password obbligatoria'),
});


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLocalError(null);
            setLoading(true);
            try {
                const res = await fetch('http://localhost:5001/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                    credentials: 'include'
                });

                const data = await res.json();

                if (!res.ok) {
                    setLocalError(data.message || 'Errore durante il login');
                    setLoading(false);
                    return;
                }

                dispatch(loginUser({
                    user: data,
                    token: data.token
                }));

                navigate('/Dashboard');
            } catch (err) {
                const errorMessage = err.message || 'Errore durante il login';
                setLocalError(errorMessage);
                console.error('Errore login:', err);
                setLoading(false);
            }
        },
    });

    return (
        <>
            <style>{GlobalStyle}</style>

            
            <HeaderBar onClick={() => navigate('/')}>
                <LogoImg src={require('../Assets/Logo.png')} alt="npm " />
                <BrandText>ApuliaEvents</BrandText>
            </HeaderBar>

            <LoginContainer>
                <FormWrapper>
                    <FormSectionLog>
                        <Title>Accedi al tuo account</Title>
                        <SubtitleLog>
                            Non hai un account?{' '}
                            <TextLink onClick={() => navigate('/registrazione')}>
                                Registrati
                            </TextLink>
                        </SubtitleLog>

                        {localError && (
                            <Alert severity="error" sx={{ marginBottom: 2, borderRadius: 3, fontSize: '15px',backgroundColor:"transparent", color:"#ff6b6b","& .MuiAlert-icon": { color: "#ff6b6b", },fontFamily: "'Rische', serif"}}>
                                {localError}
                            </Alert>
                        )}

                        <form onSubmit={formik.handleSubmit}>
                            <FormGroup>
                                <InputContainerLog>
                                    <InputIcon>👤</InputIcon>
                                    <InputLog
                                        type="text"
                                        name="username"
                                        placeholder="Username o Email"
                                        autoComplete='username'
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </InputContainerLog>
                                {formik.touched.username && formik.errors.username && (
                                    <ErrorMessageLog>{formik.errors.username}</ErrorMessageLog>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <InputContainerLog>
                                    <InputIcon>🔒</InputIcon>
                                    <InputLog
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <ToggleIcon
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </ToggleIcon>
                                </InputContainerLog>
                                {formik.touched.password && formik.errors.password && (
                                    <ErrorMessageLog>{formik.errors.password}</ErrorMessageLog>
                                )}
                            </FormGroup>

                            <SubmitButtonLog type="submit" disabled={loading}>
                                {loading ? (
                                    <CircularProgress size={20} sx={{ color: colors.white }} />
                                ) : (
                                    'Accedi'
                                )}
                            </SubmitButtonLog>
                        </form>

                        <FooterText>© 2025 Apulia Events. Tutti i diritti riservati.</FooterText>
                    </FormSectionLog>

                    <IllustrationSection $bgImage={require('../Assets/sfondoLogin.jpg')} />
                </FormWrapper>
            </LoginContainer>
        </>
    );
};

export default Login;
