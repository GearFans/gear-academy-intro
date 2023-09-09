# gear-academy-intro

<p align="center">
  <a href="https://gitpod.io/new/#https://github.com/gearfans/gear-academy-intro">
    <img src="https://gitpod.io/button/open-in-gitpod.svg" width="240" alt="GEAR">
  </a>
</p>

[Gear Academy](https://academy.gear.rs) 课程导学

## 1️⃣. 基础知识

本地开发环境搭建: 
- [Getting started](https://academy.gear.rs/getting-started/getting-started)
- 参考 [.gitpod.yml](.gitpod.yml)

SS58地址格式介绍:
- 技术规范 https://docs.substrate.io/reference/address-formats/
  - `base58encode ( concat ( <address-type>, <address>, <checksum> ) )`
  - 256 bit / 32 byte
- 创建地址
  - [How to create an account via Polkadot.js browser extension](https://academy.gear.rs/substrate-id/polkadot-js)
  - [How to create an account via a console](https://academy.gear.rs/substrate-id/console)
- 常见地址
  - 黑洞地址 https://www.subscan.io/account/111111111111111111111111111111111HC1
    - 0x0000000000000000000000000000000000000000000000000000000000000000
  - 由 DEV KEY 派生的开发地址: `bottom drive obey lake curtain smoke basket hold race lonely fit walk`
    - `//Alice` https://www.subscan.io/account/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
      - 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
    - `//Bob` https://www.subscan.io/account/5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
      - 0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48
    - `//Charlie` https://www.subscan.io/account/5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y
      - 0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22
- 转换工具
  - https://ss58.org/
  - https://polkadot.subscan.io/tools/format_transform
  - https://www.shawntabrizi.com/substrate-js-utilities/

Actor 模型
- https://wiki.gear-tech.io/docs/gear/technology/actor-model
- 一切皆 Actor
  - Program
  - User Account
- 当 Actor 接收到消息时，可以:
  - Send a message to another actor
  - Create another actor
  - Change its own internal state
- 消息
  - Message ID
  - `Source : ActorId`
  - `Destination : ActorId`
  - Value
  - Payload
  - Entry
    - handle
    - init

合约基本结构
- entrypoints
  - init
  - handle
- [Metadata & state](https://academy.gear.rs/hello-world-metadata/metadata-and-state/)
  - state
    - `static mut STATE: Option<AppState> = None;`
  - metadata

[Gear IDEA](https://idea.gear-tech.io/programs) 部署/交互
- [Upload smart contracts](https://wiki.gear-tech.io/docs/developing-contracts/deploy)
- 测试网络
  - Vara Stable Testnet
    - `wss://testnet.vara.rs`
    - `wss://archive-testnet.vara.rs`

编写测试
- https://wiki.gear-tech.io/docs/developing-contracts/testing
- https://academy.gear.rs/hello-world-testing/testing-with-gtest

作业: 部署 Tamagotchi 合约
- https://academy.gear.rs/hello-world-upload/homework
- 参考答案
  - [01-tamagotchi-06-homework](01-tamagotchi-06-homework)

# 2️⃣. gstd 合约标准库与基本开发案例

标准库 api:
- [gstd](https://docs.gear.rs/gstd/index.html)
  - [ActorId](https://docs.gear.rs/gstd/struct.ActorId.html)
  - [MessageId](https://docs.gear.rs/gstd/struct.MessageId.html)
  - [prelude](https://docs.gear.rs/gstd/prelude/index.html)
    - [String](https://docs.gear.rs/gstd/prelude/struct.String.html)
    - [Vec](https://docs.gear.rs/gstd/prelude/struct.Vec.html)
    - [collections](https://docs.gear.rs/gstd/prelude/collections/index.html)
      - [HashMap](https://docs.gear.rs/gstd/prelude/collections/struct.HashMap.html)
      - [LinkedList](https://docs.gear.rs/gstd/prelude/collections/struct.LinkedList.html)
  - [msg](https://docs.gear.rs/gstd/msg/index.html)
    - [load](https://docs.gear.rs/gstd/msg/fn.load.html)
    - [value](https://docs.gear.rs/gstd/msg/fn.value.html)
    - [source](https://docs.gear.rs/gstd/msg/fn.source.html)
    - [send](https://docs.gear.rs/gstd/msg/fn.send.html)
    - [reply](https://docs.gear.rs/gstd/msg/fn.reply.html)
  - [exec](https://docs.gear.rs/gstd/exec/index.html)
    - [block_height](https://docs.gear.rs/gstd/exec/fn.block_height.html)
    - [block_timestamp](https://docs.gear.rs/gstd/exec/fn.block_timestamp.html)
    - [program_id](https://docs.gear.rs/gstd/exec/fn.program_id.html)
- [gmeta](https://docs.gear.rs/gmeta/)
  - [Metadata](https://docs.gear.rs/gmeta/trait.Metadata.html)
  - [InOut](https://docs.gear.rs/gmeta/type.InOut.html)
- [gtest](https://docs.gear.rs/gtest/index.html)
  - [System](https://docs.gear.rs/gtest/struct.System.html)
  - [Program](https://docs.gear.rs/gtest/struct.Program.html)
  - [Log](https://docs.gear.rs/gtest/struct.Log.html)

案例
- Escrow
  - https://github.com/gear-foundation/dapps-escrow
  - https://wiki.gear-tech.io/docs/examples/escrow
- Fungible Token
  - https://github.com/gear-foundation/dapps-fungible-token
- Non Fungible Token
  - https://github.com/gear-foundation/dapps-non-fungible-token

作业: Tamagotchi Interaction
- https://academy.gear.rs/escrow-testing/homework

# 3️⃣. 使用 `@gear-js/api` 与合约交互

`GearApi`
- https://wiki.gear-tech.io/docs/api/getting-started
- https://polkadot.js.org/docs/api/start
- https://github.com/gear-tech/gear-js/tree/main/api#getting-started

Keyring
- https://github.com/gear-tech/gear-js/tree/main/api#keyring

部署合约
- https://wiki.gear-tech.io/docs/api/submit-code
- https://wiki.gear-tech.io/docs/api/upload-program

读取合约状态
- https://wiki.gear-tech.io/docs/api/read-state

发送消息
- 发送附带金额的消息
- https://wiki.gear-tech.io/docs/api/send-message

消息的生命周期
- https://wiki.gear-tech.io/docs/gear/technology/state-transition/#messages-blocks-and-events-lifecycle

订阅事件
- https://wiki.gear-tech.io/docs/api/events

Mailbox
- https://wiki.gear-tech.io/docs/api/mailbox

More examples:
- https://github.com/gear-tech/gear-js/tree/main/api