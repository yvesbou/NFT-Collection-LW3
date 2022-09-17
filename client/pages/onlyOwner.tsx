import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled from "styled-components";
import { useAccount } from 'wagmi';


const OnlyOwner: NextPage = () => {

	const { address } = useAccount();

    return(
        <main className={styles.main}>
            <Navbar/>
            <Info>This is the "Only Owner Page" and is only visible to {address?.slice(0,5)}...{address?.slice(-5,-1)} the address which deployed the smart contracts</Info>
        </main>
    );
}

const Info = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px;
    padding: 10px;
    border-radius: 12px;
    border: transparent;
    background-color: #F8F8F8;
    box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
    background-color: orange;
`

const OnlyOwnerButton = styled.button`
	padding: 10px;
	letter-spacing: 0.1px;
	font-weight: 900;
`

export default OnlyOwner;