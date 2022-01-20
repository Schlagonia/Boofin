import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import HarvestRestake from './HarvestRestake';
import WOS from './ABIs/WOS.json';
import ZBOOFI from './ABIs/ZBOOFI.json';
import BOOFI from './ABIs/BOOFI.json';

function App() {

  //contracts
  const BOOFI_ADDRESS = '0xb00f1ad977a949a3ccc389ca1d1282a2946963b0';
  const ZBOOFI_ADDRESS = '0x67712c62d1deaebdef7401e59a9e34422e2ea87c';
  const WELLOFSOULS_ADDRESS = '0x14c323348e798da2dbBc79AcbCA34c7221E8148D';
  const avax = '0xa86a';

  const [ zboofi, setZboofi ] = useState(null);
  const [ boofi, setBoofi ] = useState(null);
  const [ wos, setWos ] = useState(null);
  const [ claimable, setClaimable ] = useState(0);
  const [ account, setAccount ] = useState();
  const [ harvesting, setHarvesting ] = useState(false);
  const [ doIt, setDoIt ] = useState();

  useEffect(() => {
    if(!account){
      connectWallet();
    }
  }, [])

  useEffect(() => {
    getBlockchainData();
  }, [account])
  
  const getBlockchainData = async () => {

      try {
        const { ethereum } = window;

        if(ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const zboofiContract = new ethers.Contract(ZBOOFI_ADDRESS, ZBOOFI.abi, signer);
          setZboofi(zboofiContract)
          console.log('Zboofi contract address', zboofiContract.address)

          const boofiContract = new ethers.Contract(BOOFI_ADDRESS, BOOFI.abi, signer);
          setBoofi(boofiContract)
          console.log('boofi contract address', boofiContract.address)

          const wosContract = new ethers.Contract(WELLOFSOULS_ADDRESS, WOS.abi, signer);
          setWos(wosContract)
          console.log('WOS contract address', wosContract.address)

          let pending = await wosContract.pendingBOOFI(account);
          //console.log(ethers.utils.formatUnits(pending, 18))
          console.log(ethers.utils.formatEther(pending))
          setClaimable(pending)
        }

      } catch(error){
          console.log(error)
      }
    
  }

  const connectWallet = async () => {
      
      try {
        const { ethereum } = window;

        if(!ethereum) {
          console.log("GEt MM YOU FUCKTARD");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts"})

        console.log("connected to ", accounts[0]);
        setAccount(accounts[0])

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('connected to Chain ' + chainId);

        if(chainId !== avax){
          alert('Change connection to AVAX');
        }

      } catch (error) {
        console.log(error)
     }
     
    }


  const harvestRestake = () => {
    
    if(account && claimable > 0){
      //start harvest
      setDoIt(1)
      setHarvesting(true);
    } else {
      alert("Please Connect an account with claimable rewards!")
    }
  }

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
      }}
      className="App"
    >
      {harvesting && <HarvestRestake
                zboofi={zboofi}
                wos={wos}
                boofi={boofi}
                account={account}
                claimable={claimable}
                doIt={doIt}
                handleClose={() => setHarvesting(!harvesting)}
            />}
      <div 
        style={{ 
          backgroundColor: 'grey',
          width: '60%', 
          height: '50%',
          borderRadius: '25px'
          }} 
          className="App-header"
      >
        <button
          style={{

          }}
          onClick={() => connectWallet()}
        >
          {account ? account : 'Connect Wallet'}
        </button>
        <p>Your Claimable Boofi: {claimable === 0 ? claimable.toFixed(2) : ethers.utils.formatEther(claimable)}</p>
        
        <button
          style={{
            width: '300px',
            height: '100px',
            borderRadius: '25px',
            color: 'white',
            backgroundColor: 'lightGreen',
            fontSize: '2em'

          }}
          className='harvest-restake' onClick={() => harvestRestake()}>
          Harvest and Re-Stake!
        </button>
      </div>
    </div>
  );
}

export default App;
