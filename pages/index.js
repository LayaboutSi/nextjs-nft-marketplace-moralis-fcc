import Head from "next/head";
import Image from "next/image";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  console.log(`IsWeb3Enabled: ${isWeb3Enabled}`);
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    // TableName
    // Function for the query
    "ActiveItems",
    (query) => query.limit(10).ascending("tokenId")
  );
  console.log(listedNfts);
  console.log("Listed NFTs:");

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          fetchingListedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.map((nft) => {
              console.log(nft.attributes);
              console.log("NFT Attributes:");
              const { price, nftAddress, tokenId, marketplaceAddress, seller } = nft.attributes;
              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              );
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
}
