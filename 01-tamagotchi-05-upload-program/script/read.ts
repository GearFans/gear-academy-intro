#!/usr/bin/env -S deno run -A
import {
  decodeAddress,
  GearApi,
  GearKeyring,
  getWasmMetadata,
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import deploy from "../dist/deploy.json" assert { type: "json" };
import { metaWasm } from "../dist/mod.ts";

let { RPC_NODE } = config();

async function initGearApi() {
  return await GearApi.create({
    providerAddress: RPC_NODE,
  });
}

async function main() {
  console.log("api is initializing. Please hold on...");

  const api = await initGearApi();

  let query = { "Code": "wtf" };

  console.log({ programId: deploy.programId, metaWasm, query });

  const result = await api.programState.read(deploy.programId, metaWasm, query);

  console.log("result:", result.toHuman());
}

await main();
Deno.exit(0);
