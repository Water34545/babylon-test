import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
const contractABI = require("./contract-abi.json");
const useBirdsContract = () => {
  const contractId = "0x8A48535CD86Abed50b8725BAa9ee205843b64899";
  const contractChainId = +process.env.DEFAULT_CHAIN_ID;
  const [birdsContract, setBirdsContract] = useState<ethers.Contract>();
  const [isReady, setIsReady] = useState(false);

  const { account, chainId, provider } = useWeb3React();
  useEffect(() => {
    if (account && +contractChainId === chainId) {
      const singer = provider.getSigner();
      const contract = new ethers.Contract(contractId, contractABI, singer);
      setBirdsContract(contract);
      setIsReady(true);
    }
  }, [contractId, account, chainId, contractChainId, provider]);

  const getBalance = async () => {
    let balance = null;

    if (birdsContract && account) {
      balance = await birdsContract.balanceOf(account);
      balance = 10 ** 18 * +ethers.utils.formatEther(balance);
    }

    return balance;
  };

  const getTokenUri = async (id: number) => {
    let tokenUri = null;

    if (birdsContract) {
      const tokenId = await birdsContract.tokenOfOwnerByIndex(account, id);
      tokenUri = await birdsContract.tokenURI(tokenId);
    }

    return tokenUri;
  };

  return { account, isReady, getBalance, getTokenUri };
};

export default useBirdsContract;
