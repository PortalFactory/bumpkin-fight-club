import Web3 from "web3";
import { FarmABI } from "./FarmABI";

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_URL));

export async function getFarm(farmId: number) {
  if (!farmId) {
    return { error: "Invalid farm id" };
  }

  const farmContract = new web3.eth.Contract(
    FarmABI,
    process.env.FARM_CONTRACT
  );

  let farm = await farmContract.methods.getFarm(farmId).call();

  return {
    farm_id: farm.tokenId,
    farm_address: farm.account,
    wallet_address: farm.owner,
  };
}
