const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
app.use(cors());
app.use(express.json());

const balances = {
  "031e6371797c478e4cbdeff350129f4e5562939661017fc00cd4543eb80fb41a6b": 100,
  "02cb938829c8997922b3d43c8ae80339daaa1df95d480aea64c222ee32536e13dd": 50,
  "02f8abe5f88d51335a1d1a0f87efc3871a89366af6d95ed39aae1cdde52108ed9b": 75,
  "02eba8d9c6993fb9d509d5a0178db3adbd9c4f94fe4a00788e68a570727e459bb4": 85,
  "024551852861a6dbcbde5ec8ca17f9b83a862d71ed5750081c374fd4f4c7d041d0": 99,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signer, recovery, message } = req.body;
  console.log(recovery);
  const signerr =secp256k1.Signature.fromCompact(signer).addRecoveryBit(recovery); // recoverd origial signer
  console.log(signerr);
  const recoved_public_key = toHex(
    signerr.recoverPublicKey(message).toRawBytes()    // recoved public key
  );
  console.log(recoved_public_key);

  if (recoved_public_key != sender) {            // if sender != public key then invalid user
    res.status(400).send({ message: "Signature invalid" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[recipient]) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender], msg: "ji" });
    }
  }
  else
  {
    res.send({error:"Invalid address"})
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
