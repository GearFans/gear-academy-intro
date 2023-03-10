import { getWasmMetadata } from "https://github.com/btwiuse/gear-js/raw/deno/api/index.ts";
import metaWasmBase64 from "../dist/meta.wasm.base64.json" assert {
  type: "json",
};

let metaWasm = Uint8Array.from(atob(metaWasmBase64), (c) => c.charCodeAt(0));

let meta = await getWasmMetadata(metaWasm);

console.log(JSON.stringify(meta, "", "  "));
