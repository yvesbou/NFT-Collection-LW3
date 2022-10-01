import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled, { keyframes, css } from "styled-components";
import { useAccount, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSnackbar } from 'react-simple-snackbar'
import failureOptions from '../components/SnackbarUIOptions/failure';
import successOptions from '../components/SnackbarUIOptions/success';
import Button from '../components/SmallerComponents/Button';
import cryptoDevsConfig from '../contracts/CryptoDevsConfig';
import { ethers } from 'ethers';
import whitelistedAddresses from '../contracts/whitelistedAddresses';


const PreSale: NextPage = () => {

    const [openFailureSnackbar, closeFailureSnackbar] = useSnackbar(failureOptions);
    const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(successOptions);

    const [mintSuccessful, setMintSuccessful] = useState(false);

	const { address, isConnected } = useAccount();

    const [eligibleForPresale, setEligibleForPresale] = useState(false);

    useEffect(() => {
        if (address != undefined) if (whitelistedAddresses.includes(address)) setEligibleForPresale(true);
    }, [address])
    

    const [isLoadingForPresaleMintExecution, setIsLoadingForPresaleMintExecution] = useState(false);
    const [isPresaleMintButtonLoading, setIsPresaleMintButtonLoading] = useState(false);

    const { config: presaleMintExecuteOnChainConfig } = usePrepareContractWrite({
        ...cryptoDevsConfig,
        functionName: 'presaleMint',
        overrides: {
            from: address,
            value: ethers.utils.parseEther('0.01'),
          },
    });

    const {
        data: presaleMintData,
        write: presaleMint,
        isLoading: isPresaleMintLoadingForApproval,
        isSuccess: isPresaleMintStarted,
        error: presaleMintError,
    } = useContractWrite(presaleMintExecuteOnChainConfig);

    const {
        data: presaleMintTxData,
        isSuccess: presaleMintTxSuccess,
        error: presaleMintTxError,
      } = useWaitForTransaction({
        hash: presaleMintData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of "outOfGas"
            console.log('Success', data)
            setIsLoadingForPresaleMintExecution(false);
            const link: string = 'https://goerli.etherscan.io/tx/' + `${presaleMintData?.hash}`
            if(data.status === 0){
                // transaction failed
                openFailureSnackbar(<p>Transaction Failed: <a href={link}>{presaleMintData?.hash.slice(0,5)}...{presaleMintData?.hash.slice(-4,presaleMintData?.hash.length)}🔗</a></p>, 10000)
            }
            if(data.status === 1){
                // transaction was successful
                openSuccessSnackbar(<p> Transaction ✅ : <a href={link}>{presaleMintData?.hash.slice(0,5)}...{presaleMintData?.hash.slice(-4,presaleMintData?.hash.length)}🔗</a></p>, 10000)
                setMintSuccessful(true);
            }
        },
        onError(error) {
            setIsLoadingForPresaleMintExecution(false);
            console.log('Error', error)
        },
    });
    

    useEffect(() => {
        if (presaleMintError) setIsLoadingForPresaleMintExecution(false);
    }, [presaleMintError])

    useEffect(() => {
        // if approval is about to happen, waiting for execution also starts
        if (isPresaleMintLoadingForApproval) {
            setMintSuccessful(false);
            setIsLoadingForPresaleMintExecution(true);
        }
    }, [isPresaleMintLoadingForApproval])

    useEffect(() => {
        // beginning of a new transaction
        if (isPresaleMintLoadingForApproval && isLoadingForPresaleMintExecution) setIsPresaleMintButtonLoading(false);
        // approval through wallet submitted, wait for transaction completion
        if (!isPresaleMintLoadingForApproval && isLoadingForPresaleMintExecution) setIsPresaleMintButtonLoading(true);
        // transaction broadcasted and executed or failed
        if (!isPresaleMintLoadingForApproval && !isLoadingForPresaleMintExecution) setIsPresaleMintButtonLoading(false);
    }, [isPresaleMintLoadingForApproval, isLoadingForPresaleMintExecution])


    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <Placeholder>
                    <MintActionAndDescriptionCard>
                        <MintTitle>Mint during Presale your NFT</MintTitle>
                        <PresaleEligibility>
                            {(eligibleForPresale && isConnected) ? `Your are lucky! Your address ${address?.slice(0,5)}...${address?.slice(-4,address.length)} is whitelisted for presale 🎉`: "Sorry. You are not whitelisted for this NFT sale."}
                        </PresaleEligibility>
                        {eligibleForPresale && 
                            <PresaleMintButton isLoading={isPresaleMintButtonLoading} isWaiting={isPresaleMintLoadingForApproval} onClick={()=>{presaleMint?.()}}>
                                {isPresaleMintLoadingForApproval && 'Waiting for approval'}
                                {isPresaleMintButtonLoading && 'Minting...'}
                                {!isPresaleMintLoadingForApproval && !isPresaleMintButtonLoading && 'Presale Mint'}
                            </PresaleMintButton>}
                    </MintActionAndDescriptionCard>
                    <NFTCardPlaceholder>
                        <NFTCard hasToRotate={mintSuccessful}>
                            <NFTCardInner hasToRotate={mintSuccessful}>
                                <NFTCardFront><br/>Reveal<br/>Your<br/>NFT<br/>Now!</NFTCardFront>
                                <NFTCardBack><br/>Your<br/>NFT<br/>is<br/>revealed!</NFTCardBack>
                            </NFTCardInner>
                        </NFTCard>
                    </NFTCardPlaceholder>
                </Placeholder>
            </main>
        </div>
    );
}

const Placeholder = styled.div`
    margin-top: 80px;
    width: 100%;
    height: 400px;
    background-color: black;
    display: flex;
    flex-direction: row;
    border-radius: 12px;
`

const MintActionAndDescriptionCard = styled.div`
    background: linear-gradient(70deg, #efd5ff 0%, #515ada 100%);
    margin: 20px;
    width: 40%;
`

const NFTCardPlaceholder = styled.div`
    background: linear-gradient(225deg, #FF6257, #FF5CA0);
    margin: 20px;
    width: 60%;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
`
interface INFTCard {
    hasToRotate?: boolean;
  }

const NFTCard = styled.div<INFTCard>`
    margin: 20px;
    padding-left: 30px;
    padding-top: 10px;
    width 40%;
    color: white;
    text-shadow: 1px 1px 10px #FFF;
    white-space: pre-wrap;
    font-size: 44px;
    font-weight: 900;
    background-color: transparent;
    perspective: 1000px;
`

const NFTCardInner = styled.div<INFTCard>`
    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 24%, rgba(0,0,0,1) 38%, rgba(11,11,11,1) 63%, rgba(28,28,28,1) 87%, rgba(40,40,40,1) 96%);
    border-radius: 12px;
    box-shadow: -1px 0px 10px 0px white inset;
    border-right: 0.5px solid #ffffff;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    ${ ({hasToRotate}) => hasToRotate && `
        transform: rotateY(180deg);
    `}
`
const NFTCardFront = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
`
const NFTCardBack = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
    color: white;
    transform: rotateY(180deg);
`

const MintTitle = styled.div`
    margin: 20px;
    padding-left: 30px;
    padding-top: 50px;
    font-size: 44px;
    font-weight: 900;
    color: white;
    text-shadow: 1px 1px 20px violet;

`

const PresaleEligibility = styled.div`
    margin: 20px;
    padding-left: 30px;
    font-size: 20px;
    font-weight: 600;
    color: white;
    text-shadow: 1px 1px 10px white;
`

const PresaleMintButton = styled(Button)`
    margin-top: 10px;
    margin-left: 50px;
    text-shadow: 1px 1px 10px white;
`;


export default PreSale;