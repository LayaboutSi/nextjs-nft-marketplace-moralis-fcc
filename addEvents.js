const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");
let chainId = process.env.chainId || 31337;
let moralisChainId = chainId == "31337" ? "1337" : chainId;

moralisChainId = "0x539"; // this is what it is set to when sync is manually created

const contractAddressArray = contractAddresses[chainId]["NftMarketplace"];
const contractAddress = contractAddressArray[contractAddressArray.length - 1];
//const contractAddress = contractAddressArray[0];

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVERURL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APPID;
const masterKey = process.env.masterKey;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Working with contract address ${contractAddress}`);

  let itemListedOptions = {
    // Moralis understands a local chain is 1337
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemListed(address,address,uint256,uint256)",
    address: contractAddress,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
    description: "Item Listed through Contract",
  };

  let itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
    description: "Item Bought through Contract",
  };

  let itemCancelledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    topic: "ItemCancelled(address,address,uint256)",
    sync_historical: true,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCancelled",
      type: "event",
    },
    tableName: "ItemCancelled",
    description: "Item Canceled through Contract",
  };

  // const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
  //   useMasterKey: true,
  // });
  // const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
  //   useMasterKey: true,
  // });
  const cancelledResponse = await Moralis.Cloud.run("watchContractEvent", itemCancelledOptions, {
    useMasterKey: true,
  });
  // if (listedResponse.success && cancelledResponse.success && boughtResponse.success) {
  //   console.log("Success! Database Updated with watching events");
  // } else {
  //   console.log("Something went wrong...");
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
