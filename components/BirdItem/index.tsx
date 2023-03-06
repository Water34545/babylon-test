import S from "./styles.module.css";
import { FC, useEffect, useState } from "react";

interface IBirdItem {
  id: number;
  getTokenUri: (id: number) => Promise<string>;
  claimNFT: (id: number) => Promise<void>;
}

interface BirdAttr {
  trait_type: string;
  value: string;
}

interface Bird {
  external_url: string;
  image: string;
  name: string;
  attributes: BirdAttr[];
}
const BirdItem: FC<IBirdItem> = ({ id, getTokenUri, claimNFT }) => {
  const [uri, setUri] = useState("");
  const [tokenData, setTokenData] = useState<Bird | null>(null);
  const [isLoading, setTsLoading] = useState(false);

  useEffect(() => {
    const getTokenUriState = async () => {
      const tokenUri = await getTokenUri(id);
      setUri(tokenUri);
    };

    void getTokenUriState();
  }, []);

  useEffect(() => {
    const getTokenData = async (Uri: string) => {
      const response = await fetch(Uri);
      const tokenData = (await response.json()) as Bird;
      await setTokenData(tokenData);
    };

    uri && void getTokenData(uri);
  }, [uri]);

  const claim = async () => {
    setTsLoading(true);
    await claimNFT(id);
    setTsLoading(false);
  };

  if (!tokenData) return <div>Loading your Birds</div>;

  return (
    <div className={S.bird}>
      <h3>Bird - {tokenData.name}!</h3>
      <img
        src={tokenData.image}
        alt={`Bird - ${tokenData.name}`}
        className={S.bird_image}
      />
      <ul>
        {tokenData.attributes.map((attr) => (
          <li key={attr.trait_type}>
            {attr.trait_type}: {attr.value}
          </li>
        ))}
      </ul>
      {isLoading ? (
        "Sending Bird..."
      ) : (
        <button onClick={claim}>Claim NFT</button>
      )}
    </div>
  );
};

export default BirdItem;
