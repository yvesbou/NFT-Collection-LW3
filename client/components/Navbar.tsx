import { FC, useEffect, useState } from "react"
import Link from "next/link";
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
			<Link href="/"><TitleNavbar>💻 CryptoDevs</TitleNavbar></Link>
			<SubContainer>
				{isConnected && isOwner ? (<Link href="onlyOwner"><OnlyOwnerButton>ONLY OWNER ✋🛑</OnlyOwnerButton></Link>) : (<a target="_blank" rel="noopener noreferrer" href="https://goerli.etherscan.io/address/0x96788d3aa03b6afae42f15c059934ac53094aca8#code"><OnlyOwnerButton>View Smart Contract 📝</OnlyOwnerButton></a>)}
				<ConnectButton />
			</SubContainer>
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

const SubContainer = styled.div`
	width: 40%;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	justify-content: space-between;
	`

const TitleNavbar = styled.div`
	font-size: 30px;
    font-weight: 900;
	cursor: pointer;
`

const OnlyOwnerButton = styled.button`
	padding: 10px;
	border-radius: 12px;
	border: transparent;
	background-color: #F8F8F8;
	letter-spacing: 0.1px;
	box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
	font-weight: 900;
	transition-duration: 0.3s;
	&:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
	cursor: pointer;
`


export default Navbar;