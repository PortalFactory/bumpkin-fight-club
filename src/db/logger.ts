import { connect, isConnected, getDatabase } from "./client";
import { getFarm } from "../web3/Alchemy";

export const logVisit = async (farmId: number) => {
  if (!isConnected()) await connect();

  const database = getDatabase();
  const playersCollection = database.collection("players");

  const existingPlayer = await playersCollection.findOne({ farmId });

  const blockchainFarm = await getFarm(farmId);

  if (existingPlayer) {
    await playersCollection.updateOne(
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
    await playersCollection.insertOne({
      farmId,
      visitCount: 1,
      wallet: blockchainFarm.wallet_address,
      farm: blockchainFarm.farm_address,
    });
  }
};
