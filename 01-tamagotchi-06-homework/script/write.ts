#!/usr/bin/env -S deno run -A
import {
  decodeAddress,
  GearApi,
  GearKeyring,
  getWasmMetadata,
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import deploy from "../dist/deploy.json" assert { type: "json" };
import { meta } from "../dist/mod.ts";

let { RPC_NODE } = config();

async function initGearApi() {
  return await GearApi.create({
    providerAddress: RPC_NODE,
  });
}

async function main() {
  console.log("api is initializing. Please hold on...");

  const alice = await GearKeyring.fromSuri("//Alice");
  const aliceHex = decodeAddress(alice.address);

  const api = await initGearApi();

  const CODE = new Date().getTime().toString();

  const payload = {
    AddUrl: {
      Code: CODE,
      Url: "https://google.com",
    },
  };
  console.log(payload);

  const gas = await api.program.calculateGas.handle(
    aliceHex,
    deploy.programId,
    payload,
    0,
    true,
    meta,
  );
  console.log(`GasLimit: ${gas}\n`);

  const msg = {
    destination: deploy.programId,
    payload,
    gasLimit: gas.min_limit,
    value: 0,
  };

  console.log(msg);

  const tx = api.message.send(msg, meta);

  await new Promise((resolve, reject) => {
    tx.signAndSend(alice, ({ events, status }) => {
      console.log(`STATUS: ${status.toString()}`);
      if (status.isFinalized) {
        resolve(status.asFinalized);
      }
      events.forEach(({ event }) => {
        if (event.method === "ExtrinsicFailed") {
          reject(api.getExtrinsicFailedError(event).docs.join("\n"));
        }
      });
    });
  });
}

await main();
Deno.exit(0);
