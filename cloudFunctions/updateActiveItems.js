Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object}`);
  if (confirmed) {
    logger.info("Item Listed");
    const ActiveItems = Moralis.Object.extend("ActiveItems");
    // In case of listing update, search for already listed ActiveItem and delete
    const query = new Moralis.Query(ActiveItems);
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    logger.info(`Marketplace | Query: ${query}`);
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      await alreadyListedItem.destroy();
      logger.info(
        `Marketplace | Deleted (Listing Updated): ${request.object.get("address")} TokenId: ${request.object.get(
          "tokenId"
        )}`
      );
    }

    // Add new ActiveItem
    const activeItems = new ActiveItems();
    activeItems.set("marketplaceAddress", request.object.get("address"));
    activeItems.set("nftAddress", request.object.get("nftAddress"));
    activeItems.set("price", request.object.get("price"));
    activeItems.set("tokenId", request.object.get("tokenId"));
    activeItems.set("seller", request.object.get("seller"));
    logger.info(
      `Marketplace | Adding Item: ${request.object.get("address")} TokenId: ${request.object.get("tokenId")}`
    );
    await activeItems.save();
    logger.info(
      `Marketplace | Saved (Item Listed): ${request.object.get("address")} TokenId: ${request.object.get("tokenId")}`
    );
  }
});

Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object}`);
  if (confirmed) {
    logger.info("Item Cancelled");
    const ActiveItems = Moralis.Object.extend("ActiveItems");
    const query = new Moralis.Query(ActiveItems);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Query: ${query}`);
    const cancelledItem = await query.first();
    logger.info(`Marketplace | CancelledItem: ${JSON.stringify(cancelledItem)}`);
    if (cancelledItem) {
      await cancelledItem.destroy();
      logger.info(
        `Marketplace | Deleted (Item Cncelled): ${request.object.get("address")} TokenId: ${request.object.get(
          "tokenId"
        )}`
      );
    } else {
      logger.info(
        `Marketplace | Cancellation Failed: ${request.object.get("address")} TokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object.get("tokenId")} at address ${request.object.get("address")}`);
  if (confirmed) {
    logger.info("Item Bought");
    const ActiveItems = Moralis.Object.extend("ActiveItems");
    const query = new Moralis.Query(ActiveItems);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Query: ${query}`);
    const boughtItem = await query.first();
    logger.info(`Marketplace | BoughtItem: ${JSON.stringify(boughtItem)}`);
    if (boughtItem) {
      await boughtItem.destroy();
      logger.info(
        `Marketplace | Deleted (Item Bought): ${request.object.get("address")} TokenId: ${request.object.get(
          "tokenId"
        )}`
      );
    } else {
      logger.info(
        `Marketplace | Removal Failed: ${request.object.get("address")} TokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});
