import { useState, useEffect, useCallback } from "react";
import {
  TestContract,
  TestContract__factory,
} from "../../types/ethers-contracts";
import { useWeb3React } from "@web3-react/core";
import { TypedEvent } from "../../types/ethers-contracts/common";

export interface IEventsArgs {
  from: string;
  collection: string;
  identifier: string;
}

const useTestContract = () => {
  const contractId = "0x7B8159e0275b5c471010a448f30877f7F9Fc3412";
  const contractChainId = +process.env.DEFAULT_CHAIN_ID;
  const [testContract, setTestContract] = useState<TestContract>();
  const [isReady, setIsReady] = useState(false);
  const [events, setEvents] = useState<TypedEvent<any, IEventsArgs>[] | null>(
    []
  );

  const { account, chainId, provider } = useWeb3React();

  useEffect(() => {
    if (provider && +contractChainId === chainId) {
      if (!account) {
        const contract = TestContract__factory.connect(contractId, provider);
        setTestContract(contract);
        setIsReady(false);
      } else {
        const signer = provider.getSigner();
        const contract = TestContract__factory.connect(contractId, signer);
        setTestContract(contract);
        setIsReady(true);
      }
    }
  }, [provider, contractId, account, chainId, contractChainId]);

  const getEvents = useCallback(async () => {
    let events = [];
    try {
      events = await testContract.queryFilter<TypedEvent<any, IEventsArgs>>(
        testContract.filters.Claimed()
      );
    } catch (e) {
      console.log("getEvents err", e);
    }
    setEvents(events);
  }, [testContract]);

  useEffect(() => {
    testContract && getEvents();
  }, [getEvents, testContract]);

  const claimNFT = async (address: string, id: number) => {
    try {
      if (account) {
        const tx = await testContract.claimToken(account, {
          tokenType: 0,
          collection: address,
          identifier: id,
          amount: 1,
        });
        await tx.wait();
      }
    } catch (e) {
      console.log("claimNFT err", e);
    }
    void getEvents();
  };

  return { contractId, isReady, events, claimNFT };
};

export default useTestContract;
