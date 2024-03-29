#![no_std]
use gstd::{debug, msg, prelude::*, String};
use hello_world_io::*;

static mut GREETING: Option<String> = None;

#[no_mangle]
extern "C" fn handle() {
    let input_message: InputMessages = msg::load().expect("Error in loading InputMessages");
    let greeting = unsafe { GREETING.get_or_insert(Default::default()) };
    match input_message {
        InputMessages::SendHelloTo(account) => {
            debug!("Message: SendHelloTo {:?}", account);
            msg::send(account, greeting, 0).expect("Error in sending Hello message to account");
        }
        InputMessages::SendHelloReply => {
            debug!("Message: SendHelloReply");
            msg::reply(greeting, 0).expect("Error in sending reply");
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let greeting: String = msg::load().expect("Can't load init message");
    debug!("Program was initialized with message {:?}", greeting);
    unsafe { GREETING = Some(greeting) };
}

#[no_mangle]
extern "C" fn state() {
    let query: Query = msg::load().expect("Can't load state query");
    debug!("Program was queried with {:?}", query);
    let greeting: String = unsafe { GREETING.clone().unwrap_or(String::from("")) };
    msg::reply(greeting, 0).expect("Failed to share state");
}

#[cfg(test)]
mod hello_world_test {
    use super::InputMessages;
    use gstd::String;
    use gtest::{Log, Program, System};

    #[test]
    fn hello_test() {
        let sys = System::new();
        sys.init_logger();
        let program = Program::current(&sys);
        let res = program.send(2, String::from("Hello"));
        assert!(!res.main_failed());

        // test `SendHelloTo`
        let hello_recipient: u64 = 4;
        let res = program.send(2, InputMessages::SendHelloTo(hello_recipient.into()));
        let expected_log = Log::builder()
            .dest(hello_recipient)
            .payload(String::from("Hello"));
        assert!(res.contains(&expected_log));

        // test `SendHelloReply`
        let hello_recipient: u64 = 2;
        let res = program.send(2, InputMessages::SendHelloReply);
        let expected_log = Log::builder()
            .dest(hello_recipient)
            .payload(String::from("Hello"));
        assert!(res.contains(&expected_log));
    }
}
