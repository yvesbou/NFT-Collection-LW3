import { FC } from "react"
import styled from "styled-components";


const Hero: FC = () => {
    return (
        <Container>
            <Title>
                crypto devs
            </Title>
            <Highlight>NFT collection</Highlight>
        </Container>)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 90%;
    // background-color: red;
`

const Title = styled.div`
    display: flex;
    justify-content: center;
    // background-color: blue;
    padding: 20px;
    margin-top: 110px;
    font-family: 'Lato';
    font-weight: 900;
    font-size: 6rem;
`

const Highlight = styled.div`
    display: flex;
    justify-content: center;
    font-family: 'Lato';
    font-weight: 900;
    font-size: 6rem;
    background: -webkit-linear-gradient(30deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

export default Hero;