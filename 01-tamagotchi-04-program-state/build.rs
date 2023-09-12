use gear_wasm_builder::WasmBuilder;
use gmeta::Metadata;
use hello_world_io::ProgramMetadata;

fn main() {
    WasmBuilder::with_meta(ProgramMetadata::repr()).build();
}
