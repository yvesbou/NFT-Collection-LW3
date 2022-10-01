import { FC, useEffect, useState } from "react"
import Link from "next/link";
import styled from "styled-components";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from "wagmi";
import cryptoDevsConfig from '../contracts/CryptoDevsConfig';


// const contractConfig = {
// 	addressOrName: '0x96788D3aA03B6afAE42F15c059934ac53094Aca8',
// 	contractInterface: CryptoDevsAbi.abi,
// };

const Navbar: FC = () => {
	// states
	const [isOwner, setIsOwner] = useState(false);
	const { address, isConnected } = useAccount();

	// wagmi hooks
	const { data: ownerAddress } = useContractRead({
		...cryptoDevsConfig,
		functionName: 'owner',
		watch: true,
	});

	// react hooks
	useEffect(() => {
		if (ownerAddress) {
			const isOwner = address === ownerAddress.toString();
			setIsOwner(isOwner);
		}
	  }, [address, ownerAddress])

    return (
		<Container>
			<Link href="/"><TitleNavbar>💻 CryptoDevs</TitleNavbar></Link>
			<SubContainer>
				<Link href="/preSale"><NavbarElement>PRESALE 🎟</NavbarElement></Link>
				{isConnected && isOwner ? (<Link href="onlyOwner"><NavbarElement>ONLY OWNER ✋🛑</NavbarElement></Link>) : (<a target="_blank" rel="noopener noreferrer" href="https://goerli.etherscan.io/address/0x96788d3aa03b6afae42f15c059934ac53094aca8#code"><NavbarElement>View Smart Contract 📝</NavbarElement></a>)}
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
	height: 80px;
`

const SubContainer = styled.div`
	width: 60%;
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

const NavbarElement = styled.div`
	padding: 10px;
	border-radius: 12px;
	border: transparent;
	background-color: #F8F8F8;
	letter-spacing: 0.5px;
	font-size: 16px;
	font-weight: 600;
	box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
	transition-duration: 0.3s;
	&:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
	cursor: pointer;
`


export default Navbar;