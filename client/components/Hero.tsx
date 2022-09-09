import { FC } from "react"
import styled from "styled-components";


const Hero: FC = () => {
    return (
        <Container>
            <h1>Crypto Devs NFT Collection</h1>
        </Container>)
}

const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
    justify-content: center;
`

export default Hero;