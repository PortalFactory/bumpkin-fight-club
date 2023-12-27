import { connect, isConnected, getDatabase } from "./client";
import { getFarm } from "../web3/Alchemy";

const FIGHTS = 10;

export const onPlayerJoinDb = async (farmId: number) => {
    if (!isConnected())
        await connect();

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
            fights: FIGHTS,
            won: 0,
            lost: 0,
            score: 0
        });
    }
};

export async function onPlayerFightDb(farmId: number, score: number): Promise<void> {
    if (!isConnected())
        await connect();

    const database = getDatabase();
    const playersCollection = database.collection("players");
    const player = await playersCollection.findOne({ farmId });

    if (!player) {
        console.error("Non existing player is trying to fight", farmId);
        return;
    }

    await playersCollection.updateOne(
        { farmId },
        {
            $inc: {
                fights: -1,
                won: score >= 0 ? 1 : 0,
                lost: score < 0 ? 1 : 0,
                score
            }
        }
    );
}

export async function resetDailyFightsDb(): Promise<void> {
    if (!isConnected())
        await connect();

    const database = getDatabase();
    const playersCollection = database.collection("players");
    await playersCollection.updateMany({}, {
        $set: { fights: FIGHTS }
    },)
}
