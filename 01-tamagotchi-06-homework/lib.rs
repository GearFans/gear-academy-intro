#![no_std]

use gstd::{exec, msg, prelude::*};
use tamagotchi_io::{Tamagotchi, TmgAction, TmgEvent};

static mut STATE: Option<Tamagotchi> = None;

#[no_mangle]
extern "C" fn handle() {
    let action: TmgAction = msg::load().expect("Error in loading TmgAction");
    let state: &Tamagotchi = unsafe { STATE.as_ref().expect("failed to get contract state") };
    match action {
        TmgAction::Name => {
            let name = state.name.clone();
            msg::reply(TmgEvent::Name(name), 0).expect("Error in sending reply");
        }
        TmgAction::Age => {
            let current_block_height = exec::block_height() as u64;
            let age = current_block_height - state.date_of_birth;
            msg::reply(TmgEvent::Age(age), 0).expect("Error in sending reply");
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let name: String = msg::load().expect("Error in loading name");
    let date_of_birth = exec::block_height() as u64;
    unsafe {
        STATE = Some(Tamagotchi {
            name,
            date_of_birth,
        })
    };
}

#[no_mangle]
extern "C" fn state() {
    let state: &Tamagotchi = unsafe { STATE.as_ref().expect("failed to get contract state") };
    msg::reply(state, 0).expect("Failed to share state");
}
