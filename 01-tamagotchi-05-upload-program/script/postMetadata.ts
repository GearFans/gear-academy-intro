import {
  decodeAddress,
  GearApi,
  GearKeyring,
  getWasmMetadata,
} from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import { encode } from "https://deno.land/std/encoding/base64.ts";
import { u8aToHex } from "https://deno.land/x/polkadot/util/index.ts";

export async function postMetadata(
  api: GearApi,
  alice: GearKeyring,
  metaWasm: Uint8Array | string,
  programId: string,
  name: string,
) {
  let genesis = api.genesisHash.toHex();

  let params = {};

  if (metaWasm instanceof Uint8Array) {
    let meta = await getWasmMetadata(metaWasm);

    const signature = u8aToHex(alice.sign(JSON.stringify(meta)));

    params = {
      "name": name,
      "meta": JSON.stringify(meta),
      "title": meta.title,
      "metaWasm": encode(metaWasm),
      "signature": signature,
      "programId": programId,
      "genesis": genesis,
    };
  } else {
    params = {
      "name": name,
      "metaHex": metaWasm,
      "programId": programId,
      "genesis": genesis,
    };
  }

  console.log(params);

  let body = {
    "id": Math.floor(Math.random() * 100),
    "jsonrpc": "2.0",
    "method": "program.meta.add",
    "params": params,
  };

  let resp = await fetch("https://idea.gear-tech.io/api", {
    "headers": {
      "Accept": "application/json",
      "content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
    "method": "POST",
  });

  return await resp.json();
}
