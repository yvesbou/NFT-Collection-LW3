import { FC } from "react"
import styled from "styled-components";


const Hero: FC = () => {
    return (
        <Container>
            <Title>
                crypto devs
            </Title>
            <Highlight>NFT collection</Highlight>
            <ActionItem><Mint onClick={()=>console.log("mint")}>mint</Mint></ActionItem>
        </Container>)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 90%;
`

const Title = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    margin-top: 90px;
    font-weight: 900;
    font-size: 6rem;
`

const Highlight = styled.div`
    display: flex;
    justify-content: center;
    font-weight: 900;
    font-size: 6rem;
    background: -webkit-linear-gradient(30deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const ActionItem = styled.div`
    margin: 20px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-content: center;
`

const Mint = styled.button`
    padding: 15px;
    font-size: 2rem;
    letter-spacing: -1px;
    font-weight: 600;
    color: white;
    background: -webkit-linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    box-shadow: 0px 0px 10px 0px rgba(34,228,242,0.83);
    border-radius: 12px;
    border: transparent;
    transition-duration: 0.3s;
    &:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
    cursor: pointer;
`



export default Hero;