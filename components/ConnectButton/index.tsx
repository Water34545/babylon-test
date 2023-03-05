import { useEffect } from "react";
import { hooks, metaMask } from "../../connectors/metaMask";
import { network } from "../../connectors/network";

const defaultChainId = +process.env.DEFAULT_CHAIN_ID;

const { useAccounts } = hooks;
const ConnectButton = () => {
  const accounts = useAccounts();

  useEffect(() => {
    void network.activate().catch((e) => {
      console.log("Failed to connect to network", e);
    });
    window.ethereum &&
      void metaMask.connectEagerly().catch(() => {
        console.log("Failed to connect eagerly to metamask");
      });
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
