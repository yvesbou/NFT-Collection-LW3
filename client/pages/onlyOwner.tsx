import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled from "styled-components";
import { useAccount } from 'wagmi';


const OnlyOwner: NextPage = () => {

	const { address } = useAccount();

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <InfoPlaceholder>
                    <Info>
                        This is the "Only Owner Page" and is only visible to {address?.slice(0,5)}...{address?.slice(-5,-1)}, the address which deployed the smart contracts.
                    </Info>
                </InfoPlaceholder>
                <Grid>
                    <WithdrawBox>
                        <WithdrawBoxTitle>Ether Total Received</WithdrawBoxTitle>
                        <WithdrawBoxEtherSymbolPlaceholder>SVG</WithdrawBoxEtherSymbolPlaceholder>
                        <WithdrawBoxEtherAmount>0.124</WithdrawBoxEtherAmount>
                        <WithdrawBoxButtonPlaceholder>Withdraw</WithdrawBoxButtonPlaceholder>
                    </WithdrawBox>
                    <PresaleBox>Presale</PresaleBox>
                    <PauseContractBox>PauseContract</PauseContractBox>
                </Grid>
            </main>
        </div>
    );
}

const InfoPlaceholder = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px;
    padding: 10px;
    border-radius: 12px;
    border: transparent;
`

const Info = styled.div`
    box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
    background-color: orange;
    padding: 10px;
    border-radius: 12px;
`

const Grid = styled.div`
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
`

const WithdrawBox = styled.div`
    grid-area: 1 / 1 / 2 / 2;
    background-color: grey;
    min-height: 200px;
    border-radius: 12px;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
`
const PresaleBox = styled.div`
    grid-area: 1 / 2 / 2 / 3;
    background-color: grey;
    min-height: 200px;
    border-radius: 12px;
    padding: 20px;
`
const PauseContractBox = styled.div`
    grid-area: 2 / 1 / 3 / 2;
    background-color: grey;
    min-height: 200px;
    border-radius: 12px;
    padding: 20px;
`

const WithdrawBoxTitle = styled.div`
    grid-area: 1 / 1 / 2 / 4;
`

const WithdrawBoxEtherSymbolPlaceholder = styled.div`
    grid-area: 3 / 1 / 4 / 2;
`

const WithdrawBoxEtherAmount = styled.div`
    grid-area: 3 / 2 / 4 / 4;
`

const WithdrawBoxButtonPlaceholder = styled.button`
    grid-area: 6 / 5 / 7 / 7;
`

export default OnlyOwner;