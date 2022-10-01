import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled from "styled-components";
import { useAccount, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSnackbar } from 'react-simple-snackbar'
import failureOptions from '../components/SnackbarUIOptions/failure';
import successOptions from '../components/SnackbarUIOptions/success';
import dayjs from 'dayjs';
import Button from '../components/SmallerComponents/Button';
import cryptoDevsConfig from '../contracts/CryptoDevsConfig';



const OnlyOwner: NextPage = () => {

    const [openFailureSnackbar, closeFailureSnackbar] = useSnackbar(failureOptions);
    const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(successOptions);

	const { address, isConnected } = useAccount();

    const { data: balanceData, isError: balanceError, isLoading: balanceIsLoading } = useBalance({
        addressOrName: cryptoDevsConfig.addressOrName,
        watch: true
    })
    
    const [isOwner, setIsOwner] = useState(false);

    // withdraw
    const [isLoadingForWithdrawExecution, setIsLoadingForWithdrawExecution] = useState(false);
    const [isWithdrawButtonLoading, setIsWithdrawButtonLoading] = useState(false);

    // setPaused
    const [isLoadingForSetPausedExecution, setIsLoadingForSetPausedExecution] = useState(false);
    const [isSetPausedButtonLoading, setIsSetPausedButtonLoading] = useState(false);

    // preSale
    const [isLoadingForStartPresaleExecution, setIsLoadingForStartPresaleExecution] = useState(false);
    const [isStartPresaleButtonLoading, setIsStartPresaleButtonLoading] = useState(false);
    const [isPresaleButtonDisabledPermanently, setPresaleButtonDisabledPermantenly] = useState(false);
    const [presaleEndDatetimeString, setpresaleEndDatetimeString] = useState("");

    const [disableButton, setDisableButton] = useState(false);

    // checker for ownership

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

    /// wagmi hooks ///

    // start withdraw section ///
    const { config: withdrawExecuteOnChainConfig } = usePrepareContractWrite({
        ...cryptoDevsConfig,
        functionName: 'withdraw',
    });
    
    const {
        data: withdrawData,
        write: withdraw,
        isLoading: isWithdrawLoadingForApproval,
        isSuccess: isWithdrawStarted,
        error: withdrawError,
    } = useContractWrite(withdrawExecuteOnChainConfig);

    const {
        data: withdrawTxData,
        isSuccess: withdrawTxSuccess,
        error: withdrawTxError,
      } = useWaitForTransaction({
        hash: withdrawData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of "outOfGas"
            console.log('Success', data)
            setIsLoadingForWithdrawExecution(false);
            const link: string = 'https://goerli.etherscan.io/tx/' + `${withdrawData?.hash}`
            if(data.status === 0){
                // transaction failed
                openFailureSnackbar(<p>Transaction Failed: <a href={link}>{withdrawData?.hash.slice(0,5)}...{withdrawData?.hash.slice(-4,withdrawData?.hash.length)}🔗</a></p>, 10000)
            }
            if(data.status === 1){
                // transaction was successful
                openSuccessSnackbar(<p> Transaction ✅ : <a href={link}>{withdrawData?.hash.slice(0,5)}...{withdrawData?.hash.slice(-4,withdrawData?.hash.length)}🔗</a></p>, 10000)
            }
        },
        onError(error) {
            setIsLoadingForWithdrawExecution(false);
            console.log('Error', error)
        },
    });

    useEffect(() => {
        if (withdrawError) setIsLoadingForWithdrawExecution(false);
    }, [withdrawError])


    useEffect(() => {
        // if approval is about to happen, waiting for execution also starts
        if (isWithdrawLoadingForApproval) setIsLoadingForWithdrawExecution(true);
    }, [isWithdrawLoadingForApproval])

    useEffect(() => {
        // beginning of a new transaction
        if (isWithdrawLoadingForApproval && isLoadingForWithdrawExecution) setIsWithdrawButtonLoading(false);
        // approval through wallet submitted, wait for transaction completion
        if (!isWithdrawLoadingForApproval && isLoadingForWithdrawExecution) setIsWithdrawButtonLoading(true);
        // transaction broadcasted and executed or failed
        if (!isWithdrawLoadingForApproval && !isLoadingForWithdrawExecution) setIsWithdrawButtonLoading(false);
    }, [isWithdrawLoadingForApproval, isLoadingForWithdrawExecution])
    
    /// end withdraw section ///
    /// start pause section ///

    const { data: paused } = useContractRead({
		...cryptoDevsConfig,
		functionName: '_paused',
		watch: true,
	});

    const { config: setPausedExecuteOnChainConfig } = usePrepareContractWrite({
        ...cryptoDevsConfig,
        functionName: 'setPaused',
        args: [!paused]
    });
    
    const {
        data: setPausedData,
        write: setPaused,
        isLoading: isSetPausedLoadingForApproval,
        isSuccess: isSetPausedStarted,
        error: setPausedError,
    } = useContractWrite(setPausedExecuteOnChainConfig);

    const {
        data: setPausedTxData,
        isSuccess: txSuccess,
        error: txError,
      } = useWaitForTransaction({
        hash: setPausedData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of "outOfGas"
            console.log('Success', data)
            setIsLoadingForSetPausedExecution(false);           
            const link: string = 'https://goerli.etherscan.io/tx/' + `${setPausedData?.hash}`
            if(data.status === 0){
                // transaction failed
                openFailureSnackbar(<p>Transaction Failed: <a href={link}>{setPausedData?.hash.slice(0,5)}...{setPausedData?.hash.slice(-4,setPausedData?.hash.length)}🔗</a></p>, 10000)
            }
            if(data.status === 1){
                // transaction was successful
                openSuccessSnackbar(<p> Transaction ✅ : <a href={link}>{setPausedData?.hash.slice(0,5)}...{setPausedData?.hash.slice(-4,setPausedData?.hash.length)}🔗</a></p>, 10000)
            }
        },
        onError(error) {
            setIsLoadingForSetPausedExecution(false);
            console.log('Error', error)
        },
    });

    useEffect(() => {
        if (setPausedError) setIsLoadingForSetPausedExecution(false);
    }, [setPausedError])

    useEffect(() => {
        // if approval is about to happen, waiting for execution also starts
        if (isSetPausedLoadingForApproval) setIsLoadingForSetPausedExecution(true);
    }, [isSetPausedLoadingForApproval])

    useEffect(() => {
        // beginning of a new transaction
        if (isSetPausedLoadingForApproval && isLoadingForSetPausedExecution) setIsSetPausedButtonLoading(false);
        // approval through wallet submitted, wait for transaction completion
        if (!isSetPausedLoadingForApproval && isLoadingForSetPausedExecution) setIsSetPausedButtonLoading(true);
        // transaction broadcasted and executed or failed
        if (!isSetPausedLoadingForApproval && !isLoadingForSetPausedExecution) setIsSetPausedButtonLoading(false);
    }, [isSetPausedLoadingForApproval, isLoadingForSetPausedExecution])

    /// end pause section ///
    /// start presale launch section ///

    const { data: presaleEndedDatetime } = useContractRead({
		...cryptoDevsConfig,
		functionName: 'presaleEnded',
        watch: true
	});
    const { data: presaleStarted } = useContractRead({
		...cryptoDevsConfig,
		functionName: 'presaleStarted',
        watch: true
	});

    useEffect(() => {
        if(presaleStarted) setPresaleButtonDisabledPermantenly(true);
    }, [presaleStarted])
    

    const { config: startPresaleExecuteOnChainConfig } = usePrepareContractWrite({
        ...cryptoDevsConfig,
        functionName: 'startPresale',
    });

    const {
        data: startPresaleData,
        write: startPresale,
        isLoading: isStartPresaleLoadingForApproval,
        isSuccess: isStartPresaleStarted,
        error: startPresaleError,
    } = useContractWrite(startPresaleExecuteOnChainConfig);
    
    const {
        data: startPresaleTxData,
        isSuccess: startPresaleTxSuccess,
        error: startPresaleTxError,
      } = useWaitForTransaction({
        hash: startPresaleData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of "outOfGas"
            console.log('Success', data)
            setIsLoadingForStartPresaleExecution(false);
            const link: string = 'https://goerli.etherscan.io/tx/' + `${startPresaleData?.hash}`
            if(data.status === 0){
                // transaction failed
                openFailureSnackbar(<p>Transaction Failed: <a href={link}>{startPresaleData?.hash.slice(0,5)}...{startPresaleData?.hash.slice(-4,startPresaleData?.hash.length)}🔗</a></p>, 10000)
            }
            if(data.status === 1){
                // transaction was successful
                openSuccessSnackbar(<p> Transaction ✅ : <a href={link}>{startPresaleData?.hash.slice(0,5)}...{startPresaleData?.hash.slice(-4,startPresaleData?.hash.length)}🔗</a></p>, 10000)
            }
        },
        onError(error) {
            setIsLoadingForStartPresaleExecution(false);
            console.log('Error', error)
        },
    });

    useEffect(() => {
        if (startPresaleError) setIsLoadingForStartPresaleExecution(false);
    }, [startPresaleError])

    useEffect(() => {
        // if approval is about to happen, waiting for execution also starts
        if (isStartPresaleLoadingForApproval) setIsLoadingForStartPresaleExecution(true);
    }, [isStartPresaleLoadingForApproval])

    useEffect(() => {
        // beginning of a new transaction
        if (isStartPresaleLoadingForApproval && isLoadingForStartPresaleExecution) setIsStartPresaleButtonLoading(false);
        // approval through wallet submitted, wait for transaction completion
        if (!isStartPresaleLoadingForApproval && isLoadingForStartPresaleExecution) setIsStartPresaleButtonLoading(true);
        // transaction broadcasted and executed or failed
        if (!isStartPresaleLoadingForApproval && !isLoadingForStartPresaleExecution) setIsStartPresaleButtonLoading(false);
    }, [isStartPresaleLoadingForApproval, isLoadingForStartPresaleExecution])

    /// end presale launch section ///

    // set all buttons disabled, as soon as on-chain action is initiated and not completed
    useEffect(() => {
        const waiting: boolean = (
            isWithdrawLoadingForApproval || 
            isLoadingForWithdrawExecution ||
            isSetPausedLoadingForApproval ||
            isLoadingForSetPausedExecution ||
            isStartPresaleLoadingForApproval ||
            isLoadingForStartPresaleExecution
            );
        setDisableButton(waiting);

    }, [isWithdrawLoadingForApproval,
        isLoadingForWithdrawExecution,
        isSetPausedLoadingForApproval,
        isLoadingForSetPausedExecution,
        isStartPresaleLoadingForApproval,
        isLoadingForStartPresaleExecution
    ])
    
    useEffect(() => {
        console.log(presaleEndedDatetime?.toString())
        var presaleEndDatetimeString = presaleEndedDatetime?.toString();
        var presaleEndDateTimeNum: number | undefined = presaleEndDatetimeString ? parseInt(presaleEndDatetimeString) : undefined;
        presaleEndDateTimeNum ? presaleEndDateTimeNum *= 1000 : undefined;
        setpresaleEndDatetimeString(dayjs(presaleEndDateTimeNum).format('DD/MM/YYYY, hh:mm:ss A'))
    },[presaleEndedDatetime])
    

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <InfoPlaceholder>
                    <Info>
                        This is the &quot;Only Owner Page&quot; which is only visible to {address?.slice(0,5)}...{address?.slice(-4,address.length)}, the address which deployed the smart contracts.
                    </Info>
                </InfoPlaceholder>
                {
                    (isConnected && isOwner) &&
                <Grid>
                    <WithdrawBox>
                        <CardTitle>Total Received Ether</CardTitle>
                        <WithdrawBoxEtherSymbolPlaceholder><Image alt="ethereum-logo" src="/ethereum-eth-logo.svg" width="30" height="30"></Image></WithdrawBoxEtherSymbolPlaceholder>
                        <WithdrawBoxEtherAmount> {balanceData?.formatted} {balanceData?.symbol}</WithdrawBoxEtherAmount>
                        <Button disabled={disableButton} isLoading={isWithdrawButtonLoading} isWaiting={isWithdrawLoadingForApproval} onClick={()=>{withdraw?.();}}>
                            {isWithdrawLoadingForApproval && 'Waiting for approval'}
                            {isWithdrawButtonLoading && 'Withdrawing...'}
                            {!isWithdrawLoadingForApproval && !isWithdrawButtonLoading && 'Withdraw'}
                        </Button>
                    </WithdrawBox>
                    <PresaleBox>
                        <CardTitle>Presale Launcher</CardTitle>
                        <WithdrawBoxEtherAmount>{ presaleEndedDatetime?.toString() != '0' && `End: ${presaleEndDatetimeString}`}</WithdrawBoxEtherAmount>
                        <Button disabled={disableButton} isPermanentlyDisabled={isPresaleButtonDisabledPermanently} isLoading={isStartPresaleButtonLoading} isWaiting={isStartPresaleLoadingForApproval} onClick={()=>{startPresale?.();}}>
                            {isStartPresaleLoadingForApproval && 'Waiting for approval'}
                            {isStartPresaleButtonLoading && 'Launching 🚀...'}
                            {!presaleStarted && !isStartPresaleLoadingForApproval && !isStartPresaleButtonLoading && 'Start Presale'}
                            {presaleStarted && !isStartPresaleLoadingForApproval && !isStartPresaleButtonLoading && 'Presale Launched'}
                        </Button>
                    </PresaleBox>
                    <PauseContractBox>
                        <CardTitle>Pause Contract</CardTitle>
                        <Button disabled={disableButton} isLoading={isSetPausedButtonLoading} isWaiting={isSetPausedLoadingForApproval} onClick={() => {setPaused?.();}}>
                            {isSetPausedLoadingForApproval && 'Waiting for approval'}
                            {!paused && isSetPausedButtonLoading && 'Pausing...'}
                            {paused && isSetPausedButtonLoading && 'Resuming...'}
                            {!paused && !isSetPausedLoadingForApproval && !isSetPausedButtonLoading && 'Pause'}
                            {paused && !isSetPausedLoadingForApproval && !isSetPausedButtonLoading && 'Resume'}
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
    box-shadow: 0px 0px 32px 0px #efd5ff;
    border-radius: 15px;
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
    box-shadow: 0px 0px 5px 0px #515ada;
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
    box-shadow: 0px 0px 5px 0px #515ada;
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
    box-shadow: 0px 0px 5px 0px #515ada;
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
    grid-area: 3 / 2 / 5 / 6;
    display: flex;
    justify-content: start;
    letter-spacing: 0.5px;
    font-size: 24px;
	font-weight: 900;
`





export default OnlyOwner;