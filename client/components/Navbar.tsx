import { FC } from "react"
import styled from "styled-components";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: FC = () => {
    return (
		<Container>
			<TitleNavbar>💻 CryptoDevs</TitleNavbar>
			<ConnectButton />
		</Container>)
}


const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	justify-content: space-between;
	padding: 1rem;
`

const TitleNavbar = styled.div`
	font-size: 30px;
    font-weight: 900;
`


export default Navbar;