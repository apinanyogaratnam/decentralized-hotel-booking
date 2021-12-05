import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';

export default function Home() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connectionButtonText, setConnectionButtonText] = useState('Connect MetaMask');

    const networks = {
        rinkeby: {
            chainId: `0x${Number(4).toString(16)}`,
            chainName: 'Rinkeby Test Network',
            nativeCurrency: {
                name: 'Rinkeby Ether',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: ['https://rinkeby-light.eth.linkpool.io/'],
            blockExplorerUrls: ['https://rinkeby.etherscan.io/']
        }
    };

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
              .then(result => {
                  accountChangedHandler(result[0]);
              });
        } else {
            setErrorMessage('Install MetaMask');
        }
    }; 

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
        setConnectionButtonText(newAccount);
    };

    const getUserBalance = (account) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
          .then(balance => {
              setUserBalance(ethers.utils.formatEther(balance));
          });
    };

    const changeToRinkeby = async () => {
      try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({ 
          method: 'wallet_switchEthereumChain', 
          params: [
            { 
              chainId: networks['rinkeby'].chainId
            }
          ]
        });
      } catch (err) {
        console.log(err);
      }
    }

    const chainChangedHandler = () => {
        window.location.reload();
    };


    if (typeof window !== 'undefined') window.ethereum.on('accountsChanged', accountChangedHandler);

    if (typeof window !== 'undefined') window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <div className={styles.container}>
            {errorMessage && <p>{errorMessage}</p>}
            <h1>Book a room today</h1>
            <button onClick={connectWalletHandler}>{connectionButtonText}</button>
            <button onClick={changeToRinkeby}>Change to rinkeby network</button>
            <p>{userBalance} ETH</p>
        </div>
    );
}
