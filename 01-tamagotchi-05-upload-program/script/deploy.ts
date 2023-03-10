import {
  decodeAddress,
  GearApi,
  GearKeyring,
  getWasmMetadata,
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
// import { waitForInit } from "./waitForInit.ts";
import { postMetadata } from "./postMetadata.ts";
import { code, meta, metaHex } from "../dist/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

let { RPC_NODE, PROGRAM_NAME } = config();

async function initGearApi() {
  return await GearApi.create({
    providerAddress: RPC_NODE,
  });
}

console.log(`api (${RPC_NODE}) is initializing. Please hold on...`);

let api = await initGearApi();

// alice
let alice = await GearKeyring.fromSuri("//Alice");
let aliceHex = decodeAddress(alice.address);

// get free balance
async function showFreeBalance(api: GearApi, address: string) {
  let { data: { free } } = await api.query.system.account(address);
  console.log(`${address}'s free balance:`, free.toHuman());
}

await showFreeBalance(api, alice.address);

console.log("decodedAddress:", aliceHex);

console.log("Deploying program...");

let program = {
  code,
  gasLimit: 1000000000,
  value: 0,
  initPayload: "0x00",
};

let { codeId } = await api.program.upload(
  program,
  meta,
);

if (!await api.code.exists(codeId)) {
  console.log("CodeID not found, uploading...");
  await new Promise((resolve, reject) => {
    api.program.signAndSend(alice, ({ events, status }) => {
      // console.log(`STATUS: ${status.toString()}`);
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
} else {
  console.log("CodeID already exists, skipping upload...");
}

let gas = await api.program.calculateGas.initCreate(
  aliceHex,
  codeId,
  "0x00",
  0,
  true,
  meta,
);
// console.log(`GasLimit: ${gas}\n`);

let { programId, extrinsic } = api.program.create({
  codeId,
  initPayload: "0x00",
  gasLimit: gas.min_limit,
}, meta);

console.log({ codeId, programId });

let out = await new Promise((resolve, reject) => {
  api.program.signAndSend(alice, ({ events, status }) => {
    // console.log(`STATUS: ${status.toString()}`);
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

console.log(out);

// await waitForInit(api, programId);

console.log("Posting metadata...");

for (let i = 0; i < 10; i++) {
  // assert program exists
  if (!await api.program.exists(programId)) {
    // throw new Error("Program not found");
    console.log("Program not found");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

let resp = await postMetadata(api, alice, metaHex, programId, PROGRAM_NAME);

console.log(resp);

console.log(
  "Program deloyed:",
  `https://idea.gear-tech.io/programs/${programId}?node=${RPC_NODE}`,
);

Deno.writeTextFileSync(
  "./dist/deploy.json",
  JSON.stringify(
    {
      codeId,
      programId,
      RPC_NODE,
    },
    null,
    "  ",
  ),
);

Deno.exit(0);
