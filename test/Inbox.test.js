const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // console.log(accounts);
  // [
  //   '0x4368e7fBd7a61a93d6AA36F9e4f01923Bb8139C9',
  //   '0xCCEcfF3A49379070d9108484A3aE4f6d3743260e',
  //   '0xb982FE54f57110d0D72921527DE65C745d36dd7b',
  //   '0xaC1642692Cf5D92f5168e6f79Cb6b6eDE130ca62',
  //   '0x26AC0EC0b5F61E4dc7d2fF1762fd6DD2202d2FCA',
  //   '0xCAC67864528cF426f89Ab74133001e43457f892f',
  //   '0xD2765fc3091bC7005F1DB8086A44BDEA41eF2ABB',
  //   '0x4b0176566bB17f345E7919F554A81d6Cf361cae8',
  //   '0x0411591eadEC918DfacA7aE7fd50e5e0FE805610',
  //   '0x764f2e4D7249Cc65d01a59a31Ef14cAC609B948D'
  // ]

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"], // Passing to constructor function
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});




