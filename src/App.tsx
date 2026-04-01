import { useEffect, useState } from "react";
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';

import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export function App() {
  // const [wallets, setWallets] = useState<string[]>([]);

  const endpoint = "https://api.devnet.solana.com";    // if you use helius rpc url -> slight security issue

  return (

    // Using wallet adapter
    // Providers -> Context provider
    <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    { /* Your app's components go here, nested within the context providers. */ }
                     <Topbar/>
                    <Portfolio/>
                    <br />
                    <Send/>
                    <br />
                    <Faucet/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>



    //  {/* Without wallet Adapter  */}
    // <div>    
    //   <b>
    //     <button onClick={() => {

    //       Object.keys(window);

    //       // we can do this , but wallet adapter makes it easy to integrate multiple wallets 
    //       // if(window.phantom){
    //       //   setWallets(w => [...w,"phantom"]);
    //       // }
    //       // if(window.backpack){
    //       //   setWallets(w => [...w,"backpack"]);
    //       // }
    //       // if(window.solflare){
    //       //   setWallets(w => [...w,"solflare"]);
    //       // }
    //     }}>
    //       Connect with your wallet
    //       </button>
    //   </b>

    // </div>
  );
}

export default App;


// Send transaction
const Send = () => {

  const wallet = useWallet();
  const {connection} = useConnection();

  return (
    <>
      <div>
        <input type="text" id="address" placeholder="Wallet address" />
        <input type="text" id="amount" placeholder="amount"/>

        <button onClick={async() => {
          const transaction = new Transaction().add(
            SystemProgram.transfer(
              {
                fromPubkey: wallet.publicKey,
                toPubkey : new PublicKey(document.getElementById("address")!.value),
                lamports:  document.getElementById("amount")!.value * 1000_000_000,
              }
            )
          );

          // const signature = await sendAndConfirmRawTransaction(connection, txn, [myWallet, newAccount])    // we can't do this -> we/dapp don't store/have user's private key
          // instead of above , we do
          await wallet.sendTransaction(transaction, connection);    // sebdTransaction comes from solana wallet-adapter

        }}>
          Send
        </button>

      </div>
    </>
  )
}
// export default Send;


// Faucet -> requesting sol
const Faucet = () => {

  const {connection} = useConnection();

  return(
    <div>

      <input type="text" id="address" placeholder="Address" />
      <input type="text" id="amount" placeholder="Amount" />

      <button
        onClick={async() => {
          const pubKey = document.getElementById("address")!.value;
          const amount = document.getElementById("amount")!.value;

          console.log(pubKey);
          console.log(amount);

          // await connection.requestAirdrop(pubKey, amount * LAMPORTS_PER_SOL);
        }}
      >
        Request Sol
      </button>

    </div>
  );
}


const Topbar = () => {

  const {publicKey} = useWallet();

  return (
    <>
       <div style={{display:"flex", justifyContent: "end", gap: 10}}>
          {!publicKey && <WalletMultiButton />}
          {publicKey && <WalletDisconnectButton />}
        </div>
    </>
  );
}
// export default Topbar;

const Portfolio = () => {

  const {publicKey} = useWallet();
  const {connection} = useConnection(); // give connection object => const connection = new Connection("https://api.devnet.solana.com");
  const [balance, setBalance] = useState<null | number>(0);
   
  useEffect(() => {
    if(publicKey){
      connection.getBalance(publicKey)
        .then((balance) => setBalance(balance/LAMPORTS_PER_SOL));
      
    }
  }, [publicKey]);

  return(
    <div>
      Address : {publicKey?.toString()}
      <div>
        Balance : {balance} Sol
      </div>
    </div>
  );
}
// export default Portfolio;