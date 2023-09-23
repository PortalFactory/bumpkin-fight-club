import { connect, isConnected, getDatabase } from "./client";
import { getFarm } from "../web3/Alchemy";

export const logVisit = async (scene: string, farmId: number) => {
  if (!isConnected()) await connect();

  const database = getDatabase();
  const collection = database.collection(scene);

  const existingFarm = await collection.findOne({ farmId });

  const blockchainFarm = await getFarm(farmId);

  if (existingFarm) {
    await collection.updateOne(
      { farmId },
      {
        $inc: { visitCount: 1 },
        $set: {
          wallet: blockchainFarm.wallet_address,
          farm: blockchainFarm.farm_address,
        },
      }
    );
  } else {
    await collection.insertOne({
      farmId,
      visitCount: 1,
      wallet: blockchainFarm.wallet_address,
      farm: blockchainFarm.farm_address,
    });
  }
};
