#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId, String};
pub struct ProgramMetadata;

impl Metadata for ProgramMetadata {
    type Init = In<String>;
    type Handle = InOut<InputMessages, String>;
    type Reply = ();
    type Others = ();
    type Signal = ();
    type State = InOut<Query, String>;
}

#[derive(Encode, Decode, TypeInfo, Debug)]
pub enum Query {
    All,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum InputMessages {
    SendHelloTo(ActorId),
    SendHelloReply,
}
