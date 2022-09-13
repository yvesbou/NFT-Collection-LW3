import { FC, useEffect, useState } from "react"
import styled from "styled-components";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from "wagmi";
// import contractInterface from '../contract-abi.json'; <- deploy and describe path


const contractConfig = {
	addressOrName: '0x...',
	contractInterface: contractInterface,
};

const Navbar: FC = () => {
	// states
	const [isOwner, setIsOwner] = useState(false);
	const { isConnected } = useAccount();

	// wagmi hooks
	const { data: isOwnerContractData } = useContractRead({
		...contractConfig,
		functionName: 'owner',
		watch: true,
	  });

	// react hooks
	useEffect(() => {
		if (isOwnerContractData) {
		  setIsOwner(isOwnerContractData.toNumber());
		}
	  }, [isOwnerContractData])

    return (
		<Container>
			<TitleNavbar>💻 CryptoDevs</TitleNavbar>
			{isConnected && isOwner && (<>Only Owner</>)}
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