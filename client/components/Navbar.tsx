import { FC } from "react"
import styled from "styled-components";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: FC = () => {
    return (
		<Container>
			<ConnectButton />
		</Container>)
}


const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: row;
	justify-content: right;
	align-items: right;
`


export default Navbar;