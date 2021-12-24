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
  signJobContract: async () => {},
  createNewJob: async () => {},
  fetchJobItem: () => {},
  getMyCreatedOrOwnedJobs: () => {},
  getPublicJobs: () => {},
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
  const [listingPrice, setListingPrice] = useState();
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

  useEffect(() => {
    if (address) {
      marketContract.getListingPrice().then((price) => {
        setListingPrice(price);
      });
    }
  }, [address, marketContract]);

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
  }

  async function getPublicJobs() {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(
      agreeNFTAddress,
      AGREE.abi,
      provider
    );

    let unsigned = await marketContract.fetchUnsignedJobs();

    unsigned = await Promise.all(
      unsigned.map(async (job) => {
        const tokenUri = await tokenContract.getTokenURI(job.tokenId);
        const meta = await axios.get(tokenUri);
        const signingPrice = ethers.utils.formatUnits(
          job.signingPrice.toString(),
          'ether'
        );

        return {
          ...job,
          label: meta.data.label,
          doc: meta.data.doc,
          description: meta.data.description,
          signingPrice,
        };
      })
    );

    await setUnsignedJobs(unsigned);

    return setLoading(false);
  }

  async function fetchJobItem() {
    const { tokenId } = router.query;
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(
      agreeNFTAddress,
      AGREE.abi,
      provider
    );

    const job = await marketContract.fetchJobItem(tokenId);
    const tokenUri = await tokenContract.getTokenURI(job.tokenId);
    const meta = await axios.get(tokenUri);
    const signingPrice = ethers.utils.formatUnits(
      job.signingPrice.toString(),
      'ether'
    );

    return {
      ...job,
      label: meta.data.label,
      doc: meta.data.doc,
      description: meta.data.description,
      signingPrice,
    };
  }

  async function getMyCreatedOrOwnedJobs() {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(
      agreeNFTAddress,
      AGREE.abi,
      provider
    );

    let createdByMe = await marketContract.fetchMyCreatedJobs();
    let ownedByMe = await marketContract.fetchMyOwnedJobs();

    createdByMe = await Promise.all(
      createdByMe.map(async (job) => {
        const tokenUri = await tokenContract.getTokenURI(job.tokenId);
        const meta = await axios.get(tokenUri);
        const signingPrice = ethers.utils.formatUnits(
          job.signingPrice.toString(),
          'ether'
        );

        return {
          ...job,
          label: meta.data.label,
          doc: meta.data.doc,
          description: meta.data.description,
          signingPrice,
        };
      })
    );

    ownedByMe = await Promise.all(
      ownedByMe.map(async (job) => {
        const tokenUri = await tokenContract.getTokenURI(job.tokenId);
        const meta = await axios.get(tokenUri);
        const signingPrice = ethers.utils.formatUnits(
          job.signingPrice.toString(),
          'ether'
        );

        return {
          ...job,
          label: meta.data.label,
          doc: meta.data.doc,
          description: meta.data.description,
          signingPrice,
        };
      })
    );

    await setCreatedJobs(createdByMe);
    await setOwnedJobs(ownedByMe);

    return setLoading(false);
  }

  async function createNewJob({
    label,
    doc,
    description,
    signingPrice,
    deadlineToSign,
  }) {
    // Upload doc to IPFS
    try {
      const added = await client.add(doc);
      const uploadUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      setUrl(uploadUrl);
    } catch (err) {
      return;
    }

    if (!label || !description || !signingPrice || !deadlineToSign) {
      throw 'Please provide all fields';
    }
    // Upload metadata to IPFS
    try {
      const data = JSON.stringify({
        label,
        description,
        doc: url,
      });
      const added = await client.add(data);
      const metaUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      createJobItem({
        deadlineToSign,
        signingPrice,
        url: metaUrl,
      });
    } catch (err) {
      return;
    }
  }

  async function createJobItem({ deadlineToSign, url, signingPrice }) {
    const contract = new ethers.Contract(agreeNFTAddress, AGREE.abi, provider);
    const transaction = await contract.createToken(url);
    const tx = await transaction.wait();

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    let listingPrice: BigNumber | string =
      await marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    deadlineToSign = (
      (new Date(deadlineToSign).getTime() + 1000 * 60 * 60 * 24 * 7) /
      1000
    ).toFixed(0);

    const marketTransaction = await marketContract.createJobItem(
      agreeNFTAddress,
      tokenId,
      parseInt(deadlineToSign),
      ethers.utils.parseUnits(signingPrice, 'ether'),
      {
        value: listingPrice,
      }
    );

    await marketTransaction.wait();

    return router.push(`/contracts/${tokenId}`);
  }

  async function signJobContract({ tokenId, signingPrice }) {
    const transaction = await marketContract.signToConfirmReceival(
      agreeNFTAddress,
      tokenId,
      {
        value: ethers.utils.parseEther(signingPrice),
      }
    );

    await transaction.wait();
    router.reload();
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
        // @ts-ignore
        signJobContract,
        // @ts-ignore
        createNewJob,
        fetchJobItem,
        getMyCreatedOrOwnedJobs,
        getPublicJobs,
        connectWallet,
        disconnectWallet,
        listingPrice,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};
