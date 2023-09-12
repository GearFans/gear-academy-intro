#!/usr/bin/env -S deno run -A
import {
  decodeAddress,
  GearApi,
  GearKeyring,
  getWasmMetadata,
// } from "./gear-js/api/index.ts";
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
// import deploy from "../dist/deploy.json" assert { type: "json" };
// import { metaWasm } from "../dist/mod.ts";
import { ProgramMetadata } from "https://gear-js.deno.dev/api/index.ts";
// import { ProgramMetadata } from "./gear-js/api/index.ts";
import { parse } from "https://deno.land/std/toml/mod.ts";
import {
  hexToU8a,
  u8aToHex,
  stringToU8a,
} from "https://deno.land/x/polkadot@0.2.41/util/index.ts";
import {
  blake2AsHex,
  blake2AsU8a,
} from "https://deno.land/x/polkadot@0.2.41/util-crypto/index.ts";
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.41/types/index.ts";

let { RPC_NODE } = config();

async function initGearApi() {
  return await GearApi.create({
    providerAddress: RPC_NODE,
  });
}

export function metaTxtU8a(): Uint8Array {
  let pkgName = 'hello_world';
  return hexToU8a(Deno.readTextFileSync(`./target/wasm32-unknown-unknown/debug/${pkgName}.meta.txt`));
}

export function metaHex() {
  return u8aToHex(metaTxtU8a());
}

export function meta() {
  return ProgramMetadata.from(metaHex());
}

async function main() {
  console.log("api is initializing. Please hold on...");

  const api = await initGearApi();

  let programId = '0x5f0cc9729e5857655c28a69e7f5658b9ddeb13ab965179aa1c60f5efebdaa60b';
  let payload = {All: null};

  const result = await api.programState.read({programId, payload}, meta());
  console.log("result:", result.toHuman())

  let resultStr = api.createType('Text', stringToU8a(result))
  console.log("result:", JSON.stringify(resultStr.toString()));
}

await main();
Deno.exit(0);
