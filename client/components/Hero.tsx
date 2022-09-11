import { FC } from "react"
import styled from "styled-components";


const Hero: FC = () => {
    return (
        <Container>
            <Title>Crypto Devs NFT Collection</Title>
        </Container>)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 90%;
    background-color: red;
`

const Title = styled.div`
    font-size: 2rem;
    display: flex;
    justify-content: center;
    background-color: blue;
`

export default Hero;