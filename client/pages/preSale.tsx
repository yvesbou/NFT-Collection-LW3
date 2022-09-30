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

const PreSale: NextPage = () => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Navbar/>
                <Placeholder>
                    <MintActionAndDescriptionCard>

                    </MintActionAndDescriptionCard>
                    <NFTCardPlaceholder>
                        <NFTCard></NFTCard>
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


const slide = keyframes`
    0% {transform:translateX(-100%);}
    100% {transform:translateX(100%);}
`;

const NFTCard = styled.div`
    margin: 20px;
    width 40%;
    background: black;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px white inset;
    border-right: 1px solid #ffffff;
    border-left: 1px solid #ffffff;
    
    // &::after {
    //     content:'';
    //     // top:0;
    //     position: relative;
    //     top: 0;
    //     left: 0;
    //     display: block;
    //     transform:translateX(10%);
    //     width:50%;
    //     // height:220px;
    //     height: 100%;
    //     z-index:1;
    //     animation: ${slide} 1s infinite 3s;
    //     background: -moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(128,186,232,0) 99%, rgba(125,185,232,0) 100%); /* FF3.6+ */
	//     background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0)), color-stop(50%,rgba(255,255,255,0.8)), color-stop(99%,rgba(128,186,232,0)), color-stop(100%,rgba(125,185,232,0))); /* Chrome,Safari4+ */
    //     background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Chrome10+,Safari5.1+ */
    //     background: -o-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Opera 11.10+ */
    //     background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* IE10+ */
    //     background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* W3C */
    // }


`





export default PreSale;