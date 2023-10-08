import mongoose from 'mongoose';
import { IPlayer, Player } from './Models';

export class BumpinFightClubDB {
  static async create(uri: string, dbName: string): Promise<BumpinFightClubDB> {
    await mongoose.connect(uri, { dbName })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

    const db = mongoose.connection.db;
    return new BumpinFightClubDB(db);
  }

  constructor(private db: mongoose.mongo.Db) {}

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  };

  getPlayer(id: string): Promise<IPlayer> {
    return Player.findById(id);
  }

  async setPlayer(player: IPlayer): Promise<void> {
    const dbPlayer = new Player(player);
    await dbPlayer.save();
  }
}
