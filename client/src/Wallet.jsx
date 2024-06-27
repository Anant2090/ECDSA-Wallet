import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    const public_address=toHex(secp256k1.getPublicKey(address))
    // console.log(public_address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${public_address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
