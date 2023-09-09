PKG=tamagotchi

all: build fmt

init:
	cargo install cargo-expand
	yarn

expand:
	cargo expand > dist/lib.expanded.rs

deploy: build
	deno run -A https://gear.deno.dev/deploy.ts

build:
	mkdir -p dist
	file dist/deploy.json || echo '{}' > dist/deploy.json
	cargo build --release
	cp -v target/wasm32-unknown-unknown/release/$(PKG).opt.wasm dist/opt.wasm
	cp -v target/wasm32-unknown-unknown/release/$(PKG).meta.wasm dist/meta.wasm
	cp -v meta.txt dist/meta.txt
	cat meta.txt | jq -R | jq '"0x\(.)"' > dist/meta.txt.json
	cat dist/meta.wasm | base64 -w0 | jq -R . > dist/meta.wasm.base64.json
	cat dist/opt.wasm | base64 -w0 | jq -R . > dist/opt.wasm.base64.json
	deno run -A script/meta.ts > dist/meta.json
	cp script/mod.ts dist/mod.ts
	# node esbuild.config.mjs

repl:
	deno repl -A --eval-file=script/repl.ts

fmt:
	deno fmt --ignore=node_modules,target,dist
	cargo fmt

publish: build
	yarn publish --access public

clean:
	rm -rf dist target

start:
	deno run -A https://github.com/btwiuse/deploy_examples/raw/btwiuse/gurls/mod.tsx
