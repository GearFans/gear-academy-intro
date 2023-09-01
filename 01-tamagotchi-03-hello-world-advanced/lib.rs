#![no_std]

use gstd::{debug, msg, prelude::*, ActorId, String};
use parity_scale_codec::{Decode, Encode};
use scale_info::TypeInfo;

static mut GREETING: Option<String> = None;

#[derive(Encode, Decode, TypeInfo)]
pub enum InputMessages {
    SendHelloTo(ActorId),
    SendHelloReply,
}

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
