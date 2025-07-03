import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';


const accounts = [
  {
  'Address': '0x9966E7692817B333165c93111640Fe4E20988399',
  'PrivateKey': '0x4447ac8e06c156b26952e3423de6b2a78347309c994a4673e986051ad1ecc8ab'
  },
  {
  'Address': '0x8f552A85bf0F96E7c1e19BD1b768526DcD6d0D6b',
  'PrivateKey': '0x02b4ea317314aa917ba957f7b56a2d4c2ed0692961f8dafeaae856b0d8cd7b62'
  },
  {
  'Address': '0x6D74324f37770f2672D712761B91C4b5e33642bD',
  'PrivateKey': '0x3142ad05542a884f681bd4acbc4e91dbd64d05d0a1f2e71f8f37b4ae829c3be1'
  },
  {
  'Address': '0x5f2668f4CBBaC071501CaC6c1d5bE0EEE1FB1aDd',
  'PrivateKey': '0xa5554a87cd30ed7789330cd47434b6ccda62821a7bce768e30771f6deb30ef8f'
  },
  {
  'Address': '0x95f3C09092bD7831a839Ea3FD0558cEFbDc50416',
  'PrivateKey': '0x752f1f9dbaeaaa41684c656f6ed5e26518d677f57ac40381a971668705077c35'
  },
]

function Account({addr, pk, balance}) {
    return (
      <>
        <div className='account-container'>
          Address: {addr}
          Private Key: {pk}
          Balance: {balance}
        </div>
      </>
    )
}

function App() {
  const [balances, setBalances] = useState([0, 0, 0, 0, 0]);

  const fetchBalances = async () => {

  }


  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <>
      <img src="/raw_ratios.png" alt="Raw Ratios" />
      <img src="/normalized_supply_demand_ratios.png" alt="Normalized Supply Demand Ratios" />
      {[...Array(5).keys()].map(id => (
        <Account addr={accounts[id].Address} pk={accounts[id].accounts[id].PrivateKey} balance={balances[id]}/>
        
      ))}
    </>

  );
}

export default App;

