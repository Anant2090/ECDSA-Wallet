import { useState } from "react";
import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1"
import {toHex} from "ethereum-cryptography/utils"
import { utf8ToBytes } from "ethereum-cryptography/utils";
function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  

  
 
  async function transfer(evt) {

    evt.preventDefault();
    const msg={sender:address,amount:sendAmount,receiver:recipient} // messsage created
    const msgHash=toHex(utf8ToBytes(JSON.stringify(msg)))   // message hash created
    const sign=secp256k1.sign(msgHash,address)   //transtion signed
    console.log(sign)
    const public_key=toHex(secp256k1.getPublicKey(address)) // public key is generated from private key 
    try {
      const {
        data: { balance,msg,error },  // here we are fetching(destructuring) server respond
      } = await server.post(`send`, {
        sender: public_key,
        amount: parseInt(sendAmount),
        recipient,
        signer:sign.toCompactHex(),   //signer
        recovery:sign.recovery,   //recovry bit
        message:msgHash  //message hash
      });
      if(error)
        {
          alert(error)
        }
     else
     {
      setBalance(balance);
     }
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          // value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          // value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
