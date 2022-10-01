import { FC, useEffect, useState } from "react"
import styled from "styled-components";
import Button from "./SmallerComponents/Button";
import { useAccount, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSnackbar } from 'react-simple-snackbar'
import failureOptions from '../components/SnackbarUIOptions/failure';
import successOptions from '../components/SnackbarUIOptions/success';
import cryptoDevsConfig from "../contracts/CryptoDevsConfig";
import { ethers } from "ethers";

const Hero: FC = () => {

    const [openFailureSnackbar, closeFailureSnackbar] = useSnackbar(failureOptions);
    const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(successOptions);

	const { address, isConnected } = useAccount();

    const { data: nftsMinted } = useContractRead({
		...cryptoDevsConfig,
		functionName: 'tokenIds',
		watch: true,
	});
    
    const { data: totalNumberOfNFTs } = useContractRead({
		...cryptoDevsConfig,
		functionName: 'maxTokenIds',
	});

    const [isLoadingForMintExecution, setIsLoadingForMintExecution] = useState(false);
    const [isMintButtonLoading, setIsMintButtonLoading] = useState(false);

    const { config: mintExecuteOnChainConfig } = usePrepareContractWrite({
        ...cryptoDevsConfig,
        functionName: 'mint',
        overrides: {
            from: address,
            value: ethers.utils.parseEther('0.01'),
          },
    });

    const {
        data: mintData,
        write: mint,
        isLoading: isMintLoadingForApproval,
        isSuccess: isMintStarted,
        error: mintError,
    } = useContractWrite(mintExecuteOnChainConfig);

    const {
        data: mintTxData,
        isSuccess: mintTxSuccess,
        error: mintTxError,
      } = useWaitForTransaction({
        hash: mintData?.hash,
        onSuccess(data) {
            // can also land here if transaction fails because of "outOfGas"
            console.log('Success', data)
            setIsLoadingForMintExecution(false);
            const link: string = 'https://goerli.etherscan.io/tx/' + `${mintData?.hash}`
            if(data.status === 0){
                // transaction failed
                openFailureSnackbar(<p>Transaction Failed: <a href={link}>{mintData?.hash.slice(0,5)}...{mintData?.hash.slice(-4,mintData?.hash.length)}🔗</a></p>, 10000)
            }
            if(data.status === 1){
                // transaction was successful
                openSuccessSnackbar(<p> Transaction ✅ : <a href={link}>{mintData?.hash.slice(0,5)}...{mintData?.hash.slice(-4,mintData?.hash.length)}🔗</a></p>, 10000)
            }
        },
        onError(error) {
            setIsLoadingForMintExecution(false);
            console.log('Error', error)
        },
    });


    useEffect(() => {
        if (mintError) setIsLoadingForMintExecution(false);
    }, [mintError])

    useEffect(() => {
        // if approval is about to happen, waiting for execution also starts
        if (isMintLoadingForApproval) setIsLoadingForMintExecution(true);
    }, [isMintLoadingForApproval])

    useEffect(() => {
        // beginning of a new transaction
        if (isMintLoadingForApproval && isLoadingForMintExecution) setIsMintButtonLoading(false);
        // approval through wallet submitted, wait for transaction completion
        if (!isMintLoadingForApproval && isLoadingForMintExecution) setIsMintButtonLoading(true);
        // transaction broadcasted and executed or failed
        if (!isMintLoadingForApproval && !isLoadingForMintExecution) setIsMintButtonLoading(false);
    }, [isMintLoadingForApproval, isLoadingForMintExecution])
    
    return (
        <Container>
            <Title>
                crypto devs
            </Title>
            <Highlight>NFT collection</Highlight>
            <Placeholder>
                <MintActionAndDescriptionCard>
                    <MintTitle>Mint Your NFT</MintTitle>
                    <PresaleEligibility>{nftsMinted?.toString()} out of {totalNumberOfNFTs?.toString()} NFTs are minted.</PresaleEligibility>
                    {isConnected && 
                        <PresaleMintButton isLoading={isMintButtonLoading} isWaiting={isMintLoadingForApproval} onClick={()=>{mint?.();}}>
                            {isMintLoadingForApproval && 'Waiting for approval'}
                            {isMintButtonLoading && 'Minting...'}
                            {!isMintLoadingForApproval && !isMintButtonLoading && 'Mint'}
                        </PresaleMintButton>}
                </MintActionAndDescriptionCard>
                <NFTCardPlaceholder>
                    <NFTCard><br/>Reveal<br/>Your<br/>NFT<br/>Now!</NFTCard>
                </NFTCardPlaceholder>
            </Placeholder>
        </Container>)
}


const Container = styled.div`
	/* Layout */
	display: flex;
	flex-direction: column;
    justify-content: center;
    align-content: center;
`

const Title = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    margin-top: 90px;
    font-weight: 900;
    font-size: 6rem;
`

const Highlight = styled.div`
    display: flex;
    justify-content: center;
    font-weight: 900;
    font-size: 6rem;
    background: -webkit-linear-gradient(30deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

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
    background: radial-gradient( circle farthest-corner at 80% 90%,  rgba(255,209,67,1) 0%, rgba(255,145,83,1) 90% );
    margin: 20px;
    width: 40%;
`

const NFTCardPlaceholder = styled.div`
    background: linear-gradient( 109.6deg,  rgba(61,245,167,1) 11.2%, rgba(9,111,224,1) 91.1% );
    margin: 20px;
    width: 60%;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
`

const NFTCard = styled.div`
    margin: 20px;
    padding-left: 30px;
    padding-top: 10px;
    width 40%;
    color: white;
    text-shadow: 1px 1px 10px #FFF;
    white-space: pre-wrap;
    font-size: 44px;
    font-weight: 900;
    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 24%, rgba(0,0,0,1) 38%, rgba(11,11,11,1) 63%, rgba(28,28,28,1) 87%, rgba(40,40,40,1) 96%);
    border-radius: 12px;
    box-shadow: -1px 0px 10px 0px white inset;
    border-right: 0.5px solid #ffffff;
`

const MintTitle = styled.div`
    margin: 20px;
    padding-left: 30px;
    padding-top: 50px;
    font-size: 44px;
    font-weight: 900;
    color: white;
    text-shadow: 1px 1px 20px yellow;

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


export default Hero;
