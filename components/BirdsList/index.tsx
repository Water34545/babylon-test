import S from "./styles.module.css";
import useBirdsContract from "../../contracts/useBirdsContract";
import { useEffect, useState } from "react";
import BirdItem from "../BirdItem";

const BirdsList = () => {
  const { account, isReady, getBalance, getTokenUri } = useBirdsContract();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const updateBalance = async () => {
      const balance = await getBalance();
      setBalance(balance);
    };
    isReady && updateBalance();
  }, [isReady, getBalance]);

  if (!account) return <h2>Connect your wallet please</h2>;

  return (
    <>
      <h2>Your balance is: {balance} Birds</h2>
      <div className={S.birds}>
        {Array.apply(null, Array(balance)).map((x, i) => (
          <BirdItem key={i} id={i} getTokenUri={getTokenUri} />
        ))}
      </div>
    </>
  );
};

export default BirdsList;
