import {
  GearApi,
  GearKeyring,
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

let { RPC_NODE } = config();

async function initGearApi() {
  return await GearApi.create({
    providerAddress: RPC_NODE,
  });
}

console.log(`api (${RPC_NODE}) is initializing. Please hold on...`);

const api = await initGearApi();
