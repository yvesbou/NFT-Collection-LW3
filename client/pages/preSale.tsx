import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import styled, { keyframes, css } from "styled-components";
import { useAccount, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import CryptoDevsAbi from "../abi/abi"
import { useSnackbar } from 'react-simple-snackbar'
import failureOptions from '../components/SnackbarUIOptions/failure';
import successOptions from '../components/SnackbarUIOptions/success';
import Button from '../components/SmallerComponents/Button';

const PreSale: NextPage = () => {

    const eligibleForPresale = true;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <Placeholder>
                    <MintActionAndDescriptionCard>
                        <MintTitle>Mint during Presale your NFT</MintTitle>
                        <PresaleEligibility>
                            {eligibleForPresale ? "Your are lucky! You are eligible for presale 🎉": "Sorry. You are not whitelisted for this NFT sale."}
                        </PresaleEligibility>
                        {eligibleForPresale && <PresaleMintButton>Mint</PresaleMintButton>}
                    </MintActionAndDescriptionCard>
                    <NFTCardPlaceholder>
                        <NFTCard><br/>Reveal<br/>Your<br/>NFT<br/>Now!</NFTCard>
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
    border-color: tomato;
`;


export default PreSale;