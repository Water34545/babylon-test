import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Birds, Birds__factory } from "../../types/ethers-contracts";
import { utils } from "ethers";
const useBirdsContract = () => {
  const contractId = "0x8A48535CD86Abed50b8725BAa9ee205843b64899";
  const contractChainId = +process.env.DEFAULT_CHAIN_ID;
  const [birdsContract, setBirdsContract] = useState<Birds>();
  const [isReady, setIsReady] = useState(false);

  const { account, chainId, provider } = useWeb3React();

  useEffect(() => {
    if (account && +contractChainId === chainId) {
      const singer = provider.getSigner();
      const contract = Birds__factory.connect(contractId, singer);
      setBirdsContract(contract);
      setIsReady(true);
    }
  }, [contractId, account, chainId, contractChainId, provider]);

  const getBalance = async () => {
    let balance = null;

    try {
      if (birdsContract && account) {
        balance = await birdsContract.balanceOf(account);
        balance = 10 ** 18 * +utils.formatEther(balance);
      }
    } catch (e) {
      console.log("getBalance err", e);
    }

    return balance;
  };

  const getTokenUri = async (id: number) => {
    let tokenUri = null;

    if (birdsContract) {
      try {
        const tokenId = await birdsContract.tokenOfOwnerByIndex(account, id);
        tokenUri = await birdsContract.tokenURI(tokenId);
      } catch (e) {
        console.log("getTokenUri err", e);
      }
    }

    return tokenUri;
  };

  const approveNFT = async (id: number, testContractId: string) => {
    let tokenId = undefined;
    try {
      tokenId =
        10 ** 18 *
        +utils.formatEther(
          await birdsContract.tokenOfOwnerByIndex(account, id)
        );
      const isApproved = await birdsContract.getApproved(tokenId);
      if (!+utils.formatEther(isApproved)) {
        const tx = await birdsContract.approve(testContractId, tokenId);
        await tx.wait();
      }
    } catch (e) {
      console.log("approveNFT err", e);
    }
    return tokenId;
  };

  return { account, isReady, contractId, getBalance, getTokenUri, approveNFT };
};

export default useBirdsContract;
