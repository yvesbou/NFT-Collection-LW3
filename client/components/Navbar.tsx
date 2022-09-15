import { FC, useEffect, useState } from "react"
import styled from "styled-components";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from "wagmi";
import CryptoDevsAbi from "../abi/abi"


const contractConfig = {
	addressOrName: '0x96788D3aA03B6afAE42F15c059934ac53094Aca8',
	contractInterface: CryptoDevsAbi.abi,
};

const Navbar: FC = () => {
	// states
	const [isOwner, setIsOwner] = useState(false);
	const { address, isConnected } = useAccount();

	// wagmi hooks
	const { data: ownerAddress } = useContractRead({
		...contractConfig,
		functionName: 'owner',
		watch: true,
	  });

	// react hooks
	useEffect(() => {
		if (ownerAddress) {
			console.log(ownerAddress);
			console.log(address)
			const isOwner = address === ownerAddress.toString();
			setIsOwner(isOwner);
			console.log(isOwner)

		}
	  }, [ownerAddress])

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