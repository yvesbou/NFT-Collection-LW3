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
	align-items: flex-end;
	justify-content: flex-end;
	background-color: blue; 
	
`


export default Navbar;