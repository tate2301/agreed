/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import nookies, { parseCookies } from 'nookies';
import { createContext, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';

import { agreeNFTAddress, agreePlatformAddress } from './config';
import { AGREE, AgreePlatform } from './contracts';

export const JobsContext = createContext({
  createdJobs: [],
  ownedJobs: [],
  unsignedJobs: [],
  loading: false,
  address: '',
  marketContract: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
  listingPrice: '',
});

export const JobsContextProvider = ({ children }) => {
  const [createdJobs, setCreatedJobs] = useState([]);
  const [ownedJobs, setOwnedJobs] = useState([]);
  const [unsignedJobs, setUnsignedJobs] = useState([]);
  const [marketContract, setMarketContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState<Web3Provider>();
  const [listingPrice] = useState(
    ethers.utils.parseUnits('0.025', 'ether').toString()
  );
  const [url, setUrl] = useState('');
  const router = useRouter();
  const client = ipfsHttpClient({
    url: 'https://ipfs.infura.io:5001/api/v0',
  });

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies?.address) {
      connectWallet();
    }
  }, []);

  async function disconnectWallet() {
    setProvider(null);
    setAddress('');
    setMarketContract(null);
    setCreatedJobs([]);
    setOwnedJobs([]);
    setUnsignedJobs([]);
  }

  async function connectWallet() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    await provider.send('eth_requestAccounts', []);

    setProvider(provider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      agreePlatformAddress,
      AgreePlatform.abi,
      signer
    );

    setMarketContract(contract);

    const address = await signer.getAddress();
    await setAddress(address);
    await nookies.set(undefined, 'address', address, { path: '/' });

    window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      setAddress(accounts[0]);
      nookies.set(undefined, 'address', accounts[0], { path: '/' });
    });
    return;
  }

  return (
    <JobsContext.Provider
      value={{
        createdJobs,
        ownedJobs,
        unsignedJobs,
        loading,
        address,
        marketContract,
        connectWallet,
        disconnectWallet,
        listingPrice,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};
