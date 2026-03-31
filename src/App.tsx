import { useEffect, useState } from "react";
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';

import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

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