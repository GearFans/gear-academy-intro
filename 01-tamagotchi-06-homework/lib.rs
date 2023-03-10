#![no_std]

use gstd::{msg, prelude::*};
use tamagotchi_io::{Tamagotchi, TmgAction, TmgEvent};

static mut STATE: Option<Tamagotchi> = None;

#[no_mangle]
extern "C" fn handle() {
    let action: TmgAction = msg::load().expect("Error in loading TmgAction");
    let state: &Tamagotchi = unsafe { STATE.as_ref().expect("failed to get contract state") };
    match action {
        TmgAction::Name => {
            msg::reply(TmgEvent::Name(state.name.clone()), 0).expect("Error in sending reply");
        }
        TmgAction::Age => {
            msg::reply(TmgEvent::Age(state.date_of_birth), 0).expect("Error in sending reply");
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let name: String = msg::load().expect("Error in loading name");
    let date_of_birth = 0u64;
    unsafe {
        STATE = Some(Tamagotchi {
            name,
            date_of_birth,
        })
    };
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!(".metahash");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}

#[no_mangle]
extern "C" fn state() {
    let state: &Tamagotchi = unsafe { STATE.as_ref().expect("failed to get contract state") };
    msg::reply(state, 0).expect("Failed to share state");
}
