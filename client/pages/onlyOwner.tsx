import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled, { keyframes, css } from "styled-components";
import { useAccount, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import CryptoDevsAbi from "../abi/abi"
import { time } from 'console';


// const contractConfig = {
// 	addressOrName: '0x96788D3aA03B6afAE42F15c059934ac53094Aca8',
// 	contractInterface: CryptoDevsAbi.abi,
// };
const contractConfig = {
	addressOrName: '0xa7328fcb002e0ce55ff6a56e3499f0ef01b77692',
	contractInterface: CryptoDevsAbi.abi,
};

interface IProps {
    isLoading?: boolean;
    isWaiting?: boolean;
    isPermanentlyDisabled?: boolean;
    onClick?: () => void;
  }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


const OnlyOwner: NextPage = () => {

	const { address, isConnected } = useAccount();

    const { data: balanceData, isError: balanceError, isLoading: balanceIsLoading } = useBalance({
        addressOrName: '0xa7328fcb002e0ce55ff6a56e3499f0ef01b77692',
        watch: true
    })
    
    const [isOwner, setIsOwner] = useState(false);

    const [waitingForApprovalForWithdraw, setWaitingForApprovalForWithdraw] = useState(false);
    const [withdrawButtonLoading, setWithdrawButtonLoading] = useState(false);
    const [waitingForApprovalForPresale, setWaitingForApprovalForPresale] = useState(false);
    const [presaleButtonLoading, setPresaleButtonLoading] = useState(false);
    const [waitingForApprovalForPausing, setWaitingForApprovalForPausing] = useState(false);
    const [pauseButtonLoading, setPauseButtonLoading] = useState(false);

    const [disableButton, setDisableButton] = useState(false);

    // will be replaced by wagmi hooks
    const [paused, setPaused] = useState(false);
    const [presaleStarted, setPresaleStarted] = useState(false);

    /// wagmi hooks ///

    // withdraw
    const { config: contractWriteConfig } = usePrepareContractWrite({
        ...contractConfig,
        functionName: 'withdraw',
      });
    
    const {
        data: withdrawData,
        write: withdraw,
        isLoading: isWithdrawLoadingForApproval,
        isSuccess: isWithdrawStarted,
        error: withdrawError,
    } = useContractWrite(contractWriteConfig);

    const {
        data: withdrawTxData,
        isSuccess: txSuccess,
        error: txError,
      } = useWaitForTransaction({
        hash: withdrawData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of lack of gas
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        },
    });

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

    useEffect(() => {
        console.log(`withdrawData?.hash - ${withdrawData?.hash}`)
        // console.log(isWithdrawLoadingForApproval.valueOf.)
        // console.log(isWithdrawStarted.valueOf[Symbol])
        console.log(`isWithdrawStarted - ${isWithdrawStarted}`)
        console.log(`withdrawError?.message - ${withdrawError?.message}`)
        console.log(`txData?.status - ${withdrawTxData?.status}`)
        // console.log(txSuccess.valueOf.name)
        console.log(`txError?.message - ${txError?.message}`)
    
    
    }, [withdrawData, isWithdrawLoadingForApproval, isWithdrawStarted, withdrawError, withdrawTxData, txSuccess, txError])


    useEffect(() => {
        const waiting: boolean = (
            isWithdrawLoadingForApproval || 
            waitingForApprovalForPresale || 
            waitingForApprovalForPausing ||
            isWithdrawStarted ||
            presaleButtonLoading ||
            pauseButtonLoading
            );
        setDisableButton(waiting);
        console.log(`disableButton - ${withdrawTxData?.status}`)
        console.log(`isWithdrawStarted - ${isWithdrawStarted}`)
    }, [isWithdrawLoadingForApproval, waitingForApprovalForPresale, waitingForApprovalForPausing, isWithdrawStarted, presaleButtonLoading, pauseButtonLoading])
    

    const handleClickPauseButton = async () => {
        console.log("click")
        // waiting for approval
        setWaitingForApprovalForPausing(true);
        await sleep(3000);
        setWaitingForApprovalForPausing(false);
        // UI shows that state is loading
        setPauseButtonLoading(true);
        await sleep(5000);
        // smart contract call is made => wagmi contractwrite
        // listening to change of smart contract state => wagmi hook contractRead
        // state change => UI change
        setPaused(true);
        setPauseButtonLoading(false);
    }

    const handleClickWithdrawButton = async () => {
        console.log("click")
        // waiting for approval
        setWaitingForApprovalForWithdraw(true);
        await sleep(3000);
        setWaitingForApprovalForWithdraw(false);
        // UI shows that state is loading
        setWithdrawButtonLoading(true);
        await sleep(5000);
        // smart contract call is made => wagmi contractwrite
        // listening to change of smart contract state => wagmi hook contractRead
        // state change => UI change
        // setPaused(true);
        setWithdrawButtonLoading(false);
    }

    const handleClickPresaleButton = async () => {
        console.log("click")
        // waiting for approval
        setWaitingForApprovalForPresale(true);
        await sleep(3000);
        setWaitingForApprovalForPresale(false);
        // UI shows that state is loading
        setPresaleButtonLoading(true);
        await sleep(5000);
        // smart contract call is made => wagmi contractwrite
        // listening to change of smart contract state => wagmi hook contractRead
        // state change => UI change
        // setPaused(true);
        setPresaleStarted(true);
        setPresaleButtonLoading(false);
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
                {
                    (isConnected && isOwner) &&
                <Grid>
                    <WithdrawBox>
                        <CardTitle>Total Received Ether</CardTitle>
                        <WithdrawBoxEtherSymbolPlaceholder><Image src="/ethereum-eth-logo.svg" width="30" height="30"></Image></WithdrawBoxEtherSymbolPlaceholder>
                        <WithdrawBoxEtherAmount> {balanceData?.formatted} {balanceData?.symbol}</WithdrawBoxEtherAmount>
                        <Button disabled={disableButton} isLoading={isWithdrawStarted} isWaiting={isWithdrawLoadingForApproval} onClick={()=>{withdraw?.();}}>
                            {isWithdrawLoadingForApproval && 'Waiting for approval'}
                            {isWithdrawStarted && 'Withdrawing...'}
                            {!isWithdrawLoadingForApproval && !isWithdrawStarted && 'Withdraw'}
                        </Button>
                    </WithdrawBox>
                    <PresaleBox>
                        <CardTitle>Presale Launcher</CardTitle>
                        <Button disabled={disableButton} isPermanentlyDisabled={presaleStarted} isLoading={presaleButtonLoading} isWaiting={waitingForApprovalForPresale} onClick={()=>{handleClickPresaleButton();}}>
                            {waitingForApprovalForPresale && 'Waiting for approval'}
                            {presaleButtonLoading && 'Launching 🚀...'}
                            {!presaleStarted && !waitingForApprovalForPresale && !presaleButtonLoading && 'Start Presale'}
                            {presaleStarted && !waitingForApprovalForPresale && !presaleButtonLoading && 'Presale Launched'}
                        </Button>
                    </PresaleBox>
                    <PauseContractBox>
                        <CardTitle>Pause Contract</CardTitle>
                        <Button disabled={disableButton} isLoading={pauseButtonLoading} isWaiting={waitingForApprovalForPausing} onClick={() => {handleClickPauseButton();}}>
                            {waitingForApprovalForPausing && 'Waiting for approval'}
                            {!paused && pauseButtonLoading && 'Pausing...'}
                            {paused && pauseButtonLoading && 'Resuming...'}
                            {!paused && !waitingForApprovalForPausing && !pauseButtonLoading && 'Pause'}
                            {paused && !waitingForApprovalForPausing && !pauseButtonLoading && 'Resume'}
                        </Button>
                    </PauseContractBox>
                </Grid>
                }
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

const pulse = keyframes`
    0% { opacity: 0 }
    100% { opacity: '100%' }
`;

const Button = styled.button<IProps>`
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

    ${ ({disabled}) => disabled && `
        // background: rgba(22, 25, 31, 0.24);
        &:hover {
            transform: scale(1) perspective(1px)
        }
        cursor: auto;
    `}

    ${ ({isPermanentlyDisabled}) => isPermanentlyDisabled && `
        background: rgba(22, 25, 31, 0.24);
        &:hover {
            transform: scale(1) perspective(1px)
        }
        cursor: auto;
    `}

    ${ ({isWaiting}) => isWaiting && `
        background: rgba(22, 25, 31, 0.24);
        font-size: 20px;
        &:hover {
            transform: scale(1) perspective(1px)
        }
        cursor: auto;
    `}

    ${ ({isLoading}) => isLoading && css`
        background-image: linear-gradient(270deg, #FF6257, #FF5CA0);
        position: relative;
        font-size: 20px;
        &:hover {
            transform: scale(1) perspective(1px)
        }
        cursor: auto;
        &::after {
            animation-name: ${pulse};
            animation-duration: 800ms;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            background-color: #FF6257;
            border-radius: inherit;
            font-size: 20px;
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