#![no_std]
use gstd::{debug, msg, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    msg::reply("Hello", 0).expect("Error in sending a reply message");
}

#[no_mangle]
extern "C" fn init() {
    let init_message: String =
        String::from_utf8(msg::load_bytes().expect("Can't load init message"))
            .expect("Error in decoding");
    debug!("Program was initialized with message {:?}", init_message);
}
