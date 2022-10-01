import styled, { keyframes, css, StyledComponent } from "styled-components";


interface IProps {
    isLoading?: boolean;
    isWaiting?: boolean;
    isPermanentlyDisabled?: boolean;
    onClick?: () => void;
  }

const pulse = keyframes`
0% { opacity: 0 }
100% { opacity: '100%' }
`;

const Button = styled.button<IProps>`
grid-area: 5 / 4 / 7 / 7;
padding: 15px;
font-size: 24px;
letter-spacing: 1px;
font-weight: 600;
color: white;
transition: all ease 100ms;
background: black;
border-radius: 12px;
border: transparent;
transition-duration: 0.3s;
&:hover {
    transition: 0.3s ease-out;
    transform: scale(1.05) perspective(1px)
}
cursor: pointer;

${ ({disabled}) => disabled && `
    // background: rgba(22, 25, 31, 0.24);
    &:hover {
        transform: scale(1) perspective(1px)
    }
    cursor: auto;
`}

${ ({isPermanentlyDisabled}) => isPermanentlyDisabled && `
    background: rgba(22, 25, 31, 0.24);
    &:hover {
        transform: scale(1) perspective(1px)
    }
    cursor: auto;
`}

${ ({isWaiting}) => isWaiting && `
    background: rgba(22, 25, 31, 0.24);
    font-size: 20px;
    &:hover {
        transform: scale(1) perspective(1px)
    }
    cursor: auto;
`}

${ ({isLoading}) => isLoading && css`
    background-image: linear-gradient(270deg, #FF6257, #FF5CA0);
    position: relative;
    font-size: 20px;
    &:hover {
        transform: scale(1) perspective(1px)
    }
    cursor: auto;
    &::after {
        animation-name: ${pulse};
        animation-duration: 800ms;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        background-color: #FF6257;
        border-radius: inherit;
        font-size: 20px;
        bottom: 0;
        content: ' ';
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }`
}
`

export default Button;