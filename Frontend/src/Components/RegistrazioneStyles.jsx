import styled from 'styled-components';
import { colors, FormSection, Subtitle, InputContainer,InputIcon,Input,ErrorMessage,SubmitButton} from './styles';

export const RegistrationContainer = styled.div`
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

export const PhotoSection = styled.div`
    background-image: url(${props => props.$bgImage});
    background-size: cover;
    background-position: center;
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

export const FormSectionReg = styled(FormSection)`
    padding: 20px 40px 40px 40px;
    justify-content: flex-start;

    @media (max-width: 1024px) {
        padding: 20px 30px 30px 30px;
    }

    @media (max-width: 768px) {
        padding: 40px 30px;
        height: auto;
        min-height: 100vh;
    }

    @media (max-width: 480px) {
        padding: 30px 20px;
    }

    /* Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        padding: 15px 30px;
        justify-content: flex-start;
    }
`;

export const SubtitleReg = styled(Subtitle)`
    font-size: 13px;
    margin: 0 0 25px 0;

    @media (max-width: 480px) {
        font-size: 12px;
        margin: 0 0 20px 0;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 11px;
        margin: 0 0 12px 0;
    }
`;

export const FormGroup = styled.div`
    position: relative;
    margin-bottom: 18px;

    @media (max-width: 480px) {
        margin-bottom: 14px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        margin-bottom: 10px;
    }
`;

export const InputContainerReg = styled(InputContainer)`
    padding: 14px 18px;
    min-height: 50px;
    max-width: 380px;
    margin-left: 0;

    &:hover {
        border-color: ${colors.primary};
    }

    &:focus-within {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.2);
    }

    @media (max-width: 768px) {
        max-width: 100%;
    }

    @media (max-width: 480px) {
        padding: 12px 16px;
        gap: 10px;
        min-height: 46px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        padding: 10px 14px;
        gap: 8px;
        min-height: 42px;
    }
`;

export const InputIconReg = styled(InputIcon)`
    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 15px;
    }
`;

export const InputReg = styled(Input)`
    font-size: 14px;

    @media (max-width: 480px) {
        font-size: 13px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 12px;
    }
`;

export const RadioContainer = styled.div`
    display: flex;
    gap: 25px;
    margin: 20px 0;
    padding: 14px 18px;
    background: transparent;
    border: 2px solid ${colors.white};
    border-radius: 25px;
    align-items: center;
    min-height: 50px;
    max-width: 380px;
    margin-left: 0;
    margin-right: auto;

    @media (max-width: 768px) {
        max-width: 100%;
    }

    @media (max-width: 480px) {
        gap: 20px;
        padding: 12px 16px;
        min-height: 46px;
        margin: 16px 0;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        gap: 15px;
        padding: 10px 14px;
        min-height: 42px;
        margin: 12px 0;
    }
`;

export const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.white};
    font-family: 'Rische', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin: 0;

    input {
        cursor: pointer;
        accent-color: ${colors.primary};
        width: 18px;
        height: 18px;
    }

    &:hover {
        color: ${colors.primary};
    }

    @media (max-width: 480px) {
        font-size: 13px;
        gap: 6px;

        input {
            width: 16px;
            height: 16px;
        }
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 12px;
        gap: 5px;

        input {
            width: 15px;
            height: 15px;
        }
    }
`;

export const ErrorMessageReg = styled(ErrorMessage)`
    margin: 0px 0 12px 0;
    @media (max-width: 480px) {
        font-size: 11px;
        margin: 0px 0 10px 0;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 10px;
        margin: 0px 0 8px 0;
    }
`;

export const SubmitButtonReg = styled(SubmitButton)`
    width: 380px;
    margin-top: 15px;
    margin-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

   
    @media (max-width: 768px) {
        width: 100%;
        max-width: 380px;
    }

    @media (max-width: 480px) {
        width: 100%;
        font-size: 14px;
        padding: 11px 25px;
        margin-top: 12px;
    }

    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 13px;
        padding: 9px 20px;
        margin-top: 10px;
    }
`;

export const StyledForm = styled.form`
    width: 100%;
`;

export const FormContentWrapper = styled.div`
    width: 100%;
    max-width: 380px;
    margin: 0 auto;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;
