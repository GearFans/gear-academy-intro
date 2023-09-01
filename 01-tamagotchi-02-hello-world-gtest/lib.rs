#![no_std]
use gstd::{debug, msg, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    msg::reply("Hello", 0).expect("Error in sending a reply message");
    debug!("Program replied \"Hello\" to incoming message")
}

#[no_mangle]
extern "C" fn init() {
    let init_message: String = msg::load().expect("Can't load init message");
    debug!("Program was initialized with message {:?}", init_message);
}

#[cfg(test)]
mod hello_world_test {
    use gstd::String;
    use gtest::{Log, Program, System};

    #[test]
    fn hello_test() {
        let sys = System::new();
        sys.init_logger();
        let program = Program::current(&sys);
        let res = program.send(2, String::from("INIT MESSAGE"));
        assert!(!res.main_failed());
        let res = program.send(2, String::from("HANDLE MESSAGE"));
        let expected_log = Log::builder().dest(2).payload(String::from("Hello"));
        assert!(res.contains(&expected_log));
    }
}
