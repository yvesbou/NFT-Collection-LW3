import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled, { keyframes, css } from "styled-components";
import { useAccount, useContractRead } from 'wagmi';
import CryptoDevsAbi from "../abi/abi"
import { time } from 'console';


const contractConfig = {
	addressOrName: '0x96788D3aA03B6afAE42F15c059934ac53094Aca8',
	contractInterface: CryptoDevsAbi.abi,
};

interface IProps {
    isLoading?: boolean;
    isWaiting?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
  }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


const OnlyOwner: NextPage = () => {

	const { address } = useAccount();

    const [waitingForApproval, setWaitingForApproval] = useState(false);
    const [withdrawButtonLoading, setWithdrawButtonLoading] = useState(false);
    const [presaleButtonLoading, setPresaleButtonLoading] = useState(false);
    const [pauseButtonLoading, setPauseButtonLoading] = useState(false);

    // will be replaced by wagmi hook
    const [paused, setPaused] = useState(false);

    // wagmi hooks
	// const { data: ownerAddress } = useContractRead({
	// 	...contractConfig,
	// 	functionName: 'owner',
	// 	watch: true,
	// });

    const handleClickPauseButton = async () => {
        // waiting for approval
        setWaitingForApproval(true);
        await sleep(3000);
        setWaitingForApproval(false);
        // UI shows that state is loading
        setPauseButtonLoading(true);
        await sleep(5000);
        // smart contract call is made => wagmi contractwrite
        // listening to change of smart contract state => wagmi hook contractRead
        // state change => UI change
        setPaused(true);
        setPauseButtonLoading(false);
    }

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <InfoPlaceholder>
                    <Info>
                        This is the "Only Owner Page" which is only visible to {address?.slice(0,5)}...{address?.slice(-4,address.length)}, the address which deployed the smart contracts.
                    </Info>
                </InfoPlaceholder>
                <Grid>
                    <WithdrawBox>
                        <CardTitle>Total Received Ether</CardTitle>
                        <WithdrawBoxEtherSymbolPlaceholder><Image src="/ethereum-eth-logo.svg" width="30" height="30"></Image></WithdrawBoxEtherSymbolPlaceholder>
                        <WithdrawBoxEtherAmount>0.124</WithdrawBoxEtherAmount>
                        <WithdrawBoxButton>Withdraw</WithdrawBoxButton>
                    </WithdrawBox>
                    <PresaleBox>
                        <CardTitle>Presale Launcher</CardTitle>
                        <PresaleLaunchButton>Start Presale</PresaleLaunchButton>
                    </PresaleBox>
                    <PauseContractBox>
                        <CardTitle>Pause Contract</CardTitle>
                        <PauseContractButton isLoading={pauseButtonLoading} isWaiting={waitingForApproval} onClick={() => {handleClickPauseButton();}}>
                            {waitingForApproval && 'Waiting for approval'}
                            {pauseButtonLoading && 'Pausing...'}
                            {!waitingForApproval && !pauseButtonLoading && 'Pause'}
                        </PauseContractButton>
                    </PauseContractBox>
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
    // box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
    background: linear-gradient(180deg, #FC466B 0%, #3F5EFB 250%);
    background-color: orange;
    padding: 10px;
    border-radius: 12px;
    letter-spacing: 0.1px;
	font-weight: 900;
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
    background: linear-gradient(135deg, #efd5ff 0%, #515ada 100%);
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
    background: linear-gradient(-135deg, #efd5ff 0%, #515ada 100%);
    min-height: 200px;
    border-radius: 12px;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
`
const PauseContractBox = styled.div`
    grid-area: 2 / 1 / 3 / 2;
    background: linear-gradient(45deg, #efd5ff 0%, #515ada 100%);
    min-height: 200px;
    border-radius: 12px;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
`

const CardTitle = styled.div`
    grid-area: 1 / 1 / 3 / 5;
    letter-spacing: 0.5px;
    font-size: 28px;
	font-weight: 900;
`

const WithdrawBoxEtherSymbolPlaceholder = styled.div`
    grid-area: 3 / 1 / 5 / 3;
`

const WithdrawBoxEtherAmount = styled.div`
    grid-area: 3 / 2 / 5 / 5;
    display: flex;
    justify-content: start;
    letter-spacing: 0.5px;
    font-size: 24px;
	font-weight: 900;
`

const WithdrawBoxButton = styled.button`
    grid-area: 5 / 4 / 7 / 7;
    padding: 15px;
    font-size: 24px;
    letter-spacing: 1px;
    font-weight: 600;
    color: white;
    // background: -webkit-linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    background: black;
    border-radius: 12px;
    border: transparent;
    transition-duration: 0.3s;
    &:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
    cursor: pointer;
`

const PresaleLaunchButton = styled.button`
    grid-area: 5 / 4 / 7 / 7;
    padding: 15px;
    font-size: 24px;
    letter-spacing: 1px;
    font-weight: 600;
    color: white;
    // background: -webkit-linear-gradient(10deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    background: black;
    border-radius: 12px;
    border: transparent;
    transition-duration: 0.3s;
    &:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
    cursor: pointer;
`

// const pulse = 

const pulse = keyframes`
    0% { opacity: 0 }
    100% { opacity: '100%' }
`;

const PauseContractButton = styled.button<IProps>`
    grid-area: 5 / 4 / 7 / 7;
    padding: 15px;
    font-size: 24px;
    letter-spacing: 1px;
    font-weight: 600;
    color: white;
    transition: all ease 100ms;
    background: black;
    border-radius: 12px;
    border: transparent;
    transition-duration: 0.3s;
    &:hover {
        transition: 0.3s ease-out;
        transform: scale(1.05) perspective(1px)
    }
    cursor: pointer;

    ${ ({isWaiting}) => isWaiting && `
        background: rgba(22, 25, 31, 0.24);
    `}

    ${ ({isLoading}) => isLoading && css`
        background-image: linear-gradient(270deg, #FF6257, #FF5CA0);
        position: relative;
        &::after {
            animation-name: ${pulse};
            animation-duration: 500ms;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            background-color: #FF6257;
            border-radius: inherit;
            bottom: 0;
            content: ' ';
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }`
    }
`




export default OnlyOwner;