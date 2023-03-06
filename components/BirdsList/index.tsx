import S from "./styles.module.css";
import { FC, useCallback, useEffect, useState } from "react";
import useBirdsContract from "../../contracts/useBirdsContract";
import BirdItem from "../BirdItem";

interface IBirdsList {
  claim: (address: string, id: number) => Promise<void>;
  testContractId: string;
}

const BirdsList: FC<IBirdsList> = ({ claim, testContractId }) => {
  const { contractId, account, isReady, getBalance, getTokenUri, approveNFT } =
    useBirdsContract();
  const [balance, setBalance] = useState<number>(0);

  const updateBalance = useCallback(async () => {
    const balance = await getBalance();
    setBalance(balance);
  }, [getBalance]);

  useEffect(() => {
    isReady && updateBalance();
  }, [isReady, getBalance, updateBalance]);

  const claimNFT = useCallback(
    async (id: number) => {
      const tokenId = await approveNFT(id, testContractId);
      if (typeof tokenId !== "undefined") {
        await claim(contractId, tokenId);
        void updateBalance();
      }
    },
    [approveNFT, claim, contractId, testContractId, updateBalance]
  );

  if (!account) return <h2>Connect your wallet please</h2>;

  return (
    <>
      <h2>Your balance is: {balance} Birds</h2>
      <div className={S.birds}>
        {Array.apply(null, Array(balance)).map((x, i) => (
          <BirdItem
            key={i}
            id={i}
            getTokenUri={getTokenUri}
            claimNFT={claimNFT}
          />
        ))}
      </div>
    </>
  );
};

export default BirdsList;
