#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId};
use scale_info::TypeInfo;
pub struct ProgramMetadata;

impl Metadata for ProgramMetadata {
   type Init = InOut<String, ()>;
   type Handle = InOut<InputMessages, String>;
   type Reply = InOut<(), ()>;
   type Others = InOut<(), ()>;
   type Signal = ();
   type State = String;
}

#[derive(Encode, Decode, TypeInfo)]
pub enum InputMessages {
   SendHelloTo(ActorId),
   SendHelloReply,
}
