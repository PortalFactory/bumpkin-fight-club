import { connect, isConnected, getDatabase } from "./client";
import { getFarm } from "../web3/Alchemy";
import { LeaderboardData } from '../dto/protocol';
import { Player } from '../rooms/state/main';

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

export async function leaderboardDb(farmId: number): Promise<LeaderboardData> {
    if (!isConnected())
        await connect();

    const database = getDatabase();
    const playersCollection = database.collection<Player>("players");
    const sorted = await playersCollection.find().sort({ score: -1 }).toArray();
    const topTen = [];
    let currentFound = false;

    for (let i = 0; i < sorted.length - 1; i++) {
        if (currentFound && topTen.length === 10)
            break;

        const player = sorted[i];

        if (topTen.length === 10 && player.farmId !== farmId)
            continue;

        topTen.push({
            id: player.farmId,
            count: player.score,
            rank: i + 1
        });
    }

    return { topTen };
}
