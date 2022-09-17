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
            <Title>This is the "Only Owner Page" and is only visible to {address?.slice(0,5)}...{address?.slice(-5,-1)} the address which deployed the smart contracts</Title>
        </main>
    );
}

const Title = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px;
`

export default OnlyOwner;