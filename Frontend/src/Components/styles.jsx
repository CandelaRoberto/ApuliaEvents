import styled from 'styled-components';
import background from '../Assets/sfondoDashboard.png';

export const colors = {
    primary: '#FF8C42',
    dark: '#0A1E3D',
    white: '#FFFFFF',
    lightGray: '#E8ECEF',
};

export const Container = styled.div`
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(0deg, rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(${background});
    background-size: cover;
    background-attachment: scroll;
    
`;

export const StyledFormArea2 = styled.div`
    background-color: transparent;
    text-align: left;
    position: relative;
    flex: 1;                 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;  
    minWidth: 0;          
    min-height: 0;           
    overflow: hidden;        
    padding: 0; 
    margin: 0;             

    @media (max-width: 800px){
        flex: 1;                
        min-height: 0;
        overflow-y: auto;       
        height: 100%;           
    }
`;


//Stili per registrazione e Login

export const GlobalStyle = `
  @font-face {
    font-family: 'Rische';
    src: url('/fonts/Rische-Semibold.ttf') format('truetype');
    font-weight: 600;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
     input:-webkit-autofill,
     input:-webkit-autofill:hover,
     input:-webkit-autofill:focus,
     input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #001126 inset !important;
        -webkit-text-fill-color: #ffffff !important;
        caret-color: #ffffff !important;
        border-radius: 0;
    }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
`;

export const Title = styled.h1`
    font-size: 28px;
    color: ${colors.white};
    margin: 0 0 15px 0;
    padding: 0;
    font-weight: 580;
    letter-spacing: 1px;
    font-family: 'Rische', serif;

    @media (max-width: 768px) {
        font-size: 24px;
    }

    @media (max-width: 480px) {
        font-size: 22px;
        margin: 0 0 12px 0;
    }

    /* ← Landscape su schermi piccoli */
    @media (max-height: 600px) and (orientation: landscape) {
        font-size: 20px;
        margin: 0 0 8px 0;
    }
`;

export const Subtitle = styled.p`
    color: ${colors.lightGray};
    padding: 0;
    font-weight: 400;
    font-family: 'Rische', sans-serif;
`;

export const TextLink = styled.span`
    color: ${colors.primary};
    cursor: pointer;
    font-weight: 580;
    font-family: 'Rische', sans-serif;
    transition: all 0.3s ease;

    &:hover {
        color: #FFD700;
        text-decoration: underline;
    }
`;

export const InputIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.white};
    opacity: 0.7;
    font-size: 18px;

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

export const InputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: transparent;
    border: 2px solid ${colors.white};
    border-radius: 25px;
    transition: all 0.3s ease;
`; 

export const Input = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${colors.white};
    font-weight: 500;
    font-family: 'Rische', sans-serif;
    width: 100%;

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px transparent inset;
        -webkit-text-fill-color: ${colors.white};
    }
`; 
 
export const FormWrapper = styled.div`
    display: grid;
    grid-template-columns: 450px 1fr;
    gap: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border-radius: 0;
    overflow: hidden;

    @media (max-width: 1024px) {
        grid-template-columns: 400px 1fr;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        height: auto;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const FormSection = styled.div`
    background: #001126;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    overflow-y: auto;
    height: 100vh;
`;

export const ErrorMessage = styled.p`
    color: #ef476f;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Rische', sans-serif;
`;

export const SubmitButton = styled.button`
    padding: 12px 30px;
    background: linear-gradient(135deg, ${colors.primary}, #FF7A2E);
    border: none;
    border-radius: 25px;
    color: ${colors.white};
    font-size: 15px;
    font-weight: 580;
    letter-spacing: 0.5px;
    font-family: 'Rische', sans-serif;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255, 140, 66, 0.4);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(255, 140, 66, 0.6);
        background: linear-gradient(135deg, #FF7A2E, ${colors.primary});
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

   
`;

