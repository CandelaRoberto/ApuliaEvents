import styled from 'styled-components';
import { colors,FormSection,Subtitle,InputContainer,Input,ErrorMessage,SubmitButton} from './styles';

export const HeaderBar = styled.div`
    position: fixed;
    top: 20px;
    left: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        top: 15px;
        left: 20px;
        gap: 8px;
    }

    @media (max-width: 480px) {
        top: 10px;
        left: 15px;
        gap: 6px;
    }

    /* ← AGGIUNGI: Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        top: 10px;
        left: 15px;
        gap: 6px;
    }
`;

export const LogoImg = styled.img`
    height: 100px;
    width: auto;

    @media (max-width: 768px) {
        height: 70px;
    }

    @media (max-width: 480px) {
        height: 50px;
    }

    /* ← AGGIUNGI: Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        height: 40px;
    }
`;

export const BrandText = styled.h2`
    color: ${colors.white};
    font-size: 36px;
    font-weight: 580;
    margin: 0;
    padding: 0;
    letter-spacing: 1px;
    font-family: 'Rische', serif;

    @media (max-width: 768px) {
        font-size: 28px;
    }

    @media (max-width: 480px) {
        font-size: 22px;
    }

    /* ← AGGIUNGI: Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 18px;
    }
`;

export const LoginContainer = styled.div`
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 9999;
    background: transparent !important;
`;

export const FormSectionLog = styled(FormSection)`
    padding: 50px 40px;
    justify-content: center;

    @media (max-width: 1024px) {
        padding: 40px 30px;
    }

    @media (max-width: 768px) {
        padding: 100px 30px 40px 30px;
        height: auto;
        min-height: 100vh;
    }

    @media (max-width: 480px) {
        padding: 80px 20px 30px 20px;
    }

    /* Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        padding: 60px 30px 20px 30px;
        justify-content: flex-start;
    }
`;

export const IllustrationSection = styled.div`
    background-image: url(${props => props.$bgImage});
    background-size: cover;
    background-position: center 70%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const SubtitleLog = styled(Subtitle)`
    font-size: 14px;
    margin: 0 0 30px 0;

    @media (max-width: 480px) {
        font-size: 13px;
        margin: 0 0 25px 0;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 12px;
        margin: 0 0 15px 0;
    }
`;

export const FormGroup = styled.div`
    position: relative;
    margin-bottom: 20px;

    @media (max-width: 480px) {
        margin-bottom: 16px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        margin-bottom: 12px;
    }
`;

export const InputContainerLog = styled(InputContainer)`
    padding: 12px 16px;

    &:hover {
        border-color: ${colors.primary};
    }

    &:focus-within {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.2);
    }

    @media (max-width: 480px) {
        padding: 10px 14px;
        gap: 10px;
    }

    /* Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        padding: 8px 12px;
        gap: 8px;
    }
`;

export const InputLog = styled(Input)`
    font-size: 13px;

    @media (max-width: 480px) {
        font-size: 12px;
    }
`;

export const ToggleIcon = styled.button`
    background: none;
    border: none;
    color: ${colors.white};
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 1;
    }

    @media (max-width: 480px) {
        font-size: 14px;
    }
`;

export const ErrorMessageLog = styled(ErrorMessage)`
    margin: 0 0 15px 0;

    @media (max-width: 480px) {
        font-size: 11px;
        margin: 0 0 12px 0;
    }
`;

export const SubmitButtonLog = styled(SubmitButton)`
    width: 100%;
    margin-top: 10px;

    @media (max-width: 480px) {
        font-size: 14px;
        padding: 11px 25px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 13px;
        padding: 9px 20px;
        margin-top: 8px;
    }
`;

export const FooterText = styled.p`
    font-size: 11px;
    color: ${colors.lightGray};
    text-align: center;
    margin-top: 20px;
    padding: 0;
    font-family: 'Rische', sans-serif;

    @media (max-width: 480px) {
        font-size: 10px;
        margin-top: 15px;
    }

    /* Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 9px;
        margin-top: 10px;
    }
`;