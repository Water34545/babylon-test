import { hooks, metaMask } from "../../connectors/metaMask";
import { useEffect } from "react";

const defaultChainId = +process.env.DEFAULT_CHAIN_ID;

const { useAccounts } = hooks;
const ConnectButton = () => {
  const accounts = useAccounts();

  useEffect(() => {
    if (window && window.ethereum) {
      void metaMask.connectEagerly();
    }
  }, []);
  const connect = () => {
    if (window && !window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    void metaMask.activate(defaultChainId);
  };

  const disconnect = () => {
    metaMask.resetState();
  };

  return accounts ? (
    <>
      Acc: {accounts[0]}&nbsp;
      <button onClick={disconnect}>Disconnect</button>
    </>
  ) : (
    <button onClick={connect}>Connect</button>
  );
};
export default ConnectButton;
