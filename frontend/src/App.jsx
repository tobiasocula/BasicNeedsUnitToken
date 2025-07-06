import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { getBalances, increaseSupply, rebase } from '../backend.js';

function App() {

  const tokenAddress = "0xf7F47D4E7D1568c0863065bd07f7C197B4eD0Cca"; // proxy

  const addresses = [ // demo accounts
    "0x9966E7692817B333165c93111640Fe4E20988399",
    "0x8f552A85bf0F96E7c1e19BD1b768526DcD6d0D6b",
    "0x6D74324f37770f2672D712761B91C4b5e33642bD",
    "0x5f2668f4CBBaC071501CaC6c1d5bE0EEE1FB1aDd",
    "0x95f3C09092bD7831a839Ea3FD0558cEFbDc50416"
  ];
  const privateKeys = [ // not used here, these are the private keys of the above accounts
    "0x4447ac8e06c156b26952e3423de6b2a78347309c994a4673e986051ad1ecc8ab",
    "0x02b4ea317314aa917ba957f7b56a2d4c2ed0692961f8dafeaae856b0d8cd7b62",
    "0x3142ad05542a884f681bd4acbc4e91dbd64d05d0a1f2e71f8f37b4ae829c3be1",
    "0xa5554a87cd30ed7789330cd47434b6ccda62821a7bce768e30771f6deb30ef8f",
    "0x752f1f9dbaeaaa41684c656f6ed5e26518d677f57ac40381a971668705077c35"
  ];
  const [balances, setBalances] = useState([0, 0, 0, 0, 0]);
  const [contractBalance, setContractBalance] = useState(0);

  const [inputNewSupply, setInputNewSupply] = useState("");
  const [inputNewNormalizedSDRatio, setInputNewNormalizedSDRatio] = useState("");
  const [inputNewSpecificSDRatios, setInputNewSpecificSDRatios] = useState(["", "", "", "", ""]);

  const [loadingBalances, setLoadingBalances] = useState(false);
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    const FB = async () => {
      setLogMessages(prev => [...prev, "Submitting new supply..."]);
      setLoadingBalances(true);
      setLogMessages(prev => [...prev, "Updating balances..."]);
      const r = await getBalances();
      setLogMessages(prev => [...prev, r.msg]);
      if (r.status) {
        setBalances(r.result.slice(0,r.result.length-1));
        setContractBalance(r.result[r.result.length-1]);
        setLogMessages(prev => [...prev, "Balances updated"]);
      }
      setLoadingBalances(false);
    }
    FB();
    
  }, []);

  return (
    <>
    <h1 className='title'>Demo for visualizing Basic-Needs Supply Token</h1>

    <div className='main-content'>

    <div className='main-content-section-1'>
      
      
      <div className='account-section'>
        <h2 className='accounts-title'>Some demo accounts holding BNU Token</h2>
        {loadingBalances && (
          <h4 className='loading-balances'>Loading balances...</h4>
        )}
      {[...Array(5).keys()].map(id => (
        <div className='account-container' key={id}>
          <img src='/demo_account.png' alt='Demo Account' className='demo-account'></img>
          <div className='account-text'>
            <div className='account-text-element'>
              <div className='text1'>Address:</div>
              <div className='text2'>{addresses[id]}</div>
            </div>
            <div className='account-text-element'>
              <div className='text1'>Balance:</div>
              <div className='text2'>{parseInt(balances[id]) / 1000000000000000000}</div>
              <div className='text2'>* 10^18 $BNU</div>
            </div>
          </div>
        </div>
      ))}
      <div className='token-container'>
          <img src='/demo_account.png' alt='Demo Account' className='demo-account'></img>
          <div className='account-text'>
            <div className='account-text-element'>
              <div className='text1'>Contract itself</div>
            </div>
            <div className='account-text-element'>
              <div className='text1'>Address:</div>
              <div className='text2'>{tokenAddress}</div>
            </div>
            <div className='account-text-element'>
              <div className='text1'>Balance:</div>
              <div className='text2'>{contractBalance / 1000000000000000000}</div>
              <div className='text2'>* 10^18 $BNU</div>
            </div>
          </div>
        </div>
      </div>



        <div className='input-section'>
          <h2 className='input-section-title'>Changing parameters & input variables</h2>
          <div className='text'>Transactions might take some time (every transaction needs to get mined). Don't spam the submit button.</div>

          <div className='input-section-1'>
            <h4 className='input-section-1-title'>Example: Change supply of token (in new year, eg. 2024)</h4>
            <h5 className='input-section-1-sub'>Specify gain in %</h5>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setLogMessages(prev => [...prev, "Submitting new supply..."]);
          const supplyRes = await increaseSupply(inputNewSupply);
          setLogMessages(prev => [...prev, supplyRes.msg]);
          if (supplyRes.status) {
            setLogMessages(prev => [...prev, "Updated supply"]);
            setLoadingBalances(true);
            setLogMessages(prev => [...prev, "Updating balances..."]);
            const r = await getBalances();
            setLogMessages(prev => [...prev, r.msg]);
            if (r.status) {
              setBalances(r.result.slice(0,r.result.length-1));
              setContractBalance(r.result[r.result.length-1]);
              setLogMessages(prev => [...prev, "Balances updated"]);
            }
            setLoadingBalances(false);
          }
        }}
        className='form-class-input'
        name="form-name">
          <input className='input-text-field' type="text"
            value={inputNewSupply} onChange={(e) => {
              e.preventDefault();
              setInputNewSupply(e.target.value);
            }} placeholder='Input new supply gain (in %)'/>
          
          <button type="submit" className='basic-button'>Submit</button>
        </form>
      </div>

      <div className='input-section-2'>
            <h4 className='input-section-2-title'>Example: input new overall supply/demand ratio (in new year, eg. 2024)</h4>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setLogMessages(prev => [...prev, "Submitting new ratio..."]); 
          const r = await rebase(inputNewNormalizedSDRatio);
          setLogMessages(prev => [...prev, r.msg]);
        }}
        className='form-class-input'
        name="form-name">
          <input className='input-text-field' type="text"
            value={inputNewNormalizedSDRatio} onChange={(e) => {
              e.preventDefault();
              setInputNewNormalizedSDRatio(e.target.value);
            }} placeholder='Input new sample SD ratio'/>
          <button type="submit" className='basic-button'>Submit</button>
        </form>
      </div>

      <div className='input-section-3'>
            <h4 className='input-section-3-title'>Example: Submit new resource-specific supply/demand ratio (in new year, eg. 2024)</h4>
        <form onSubmit={async (e) => {
          e.preventDefault();
          let s = 0;
          inputNewSpecificSDRatios.forEach(item => s += parseFloat(item));
          const normalizedRatio = s / 5;
          //console.log('normalized ratio:', normalizedRatio);
          setLogMessages(prev => [...prev, `Rebasing with normalized ratio of ${normalizedRatio}`]);
          const rr = await rebase(normalizedRatio.toString());
          setLogMessages(prev => [...prev, rr.msg]);
          setLoadingBalances(true);
            setLogMessages(prev => [...prev, "Updating balances..."]);
            const r = await getBalances();
            setLogMessages(prev => [...prev, r.msg]);
            if (r.status) {
              setBalances(r.result.slice(0,r.result.length-1));
              setContractBalance(r.result[r.result.length-1]);
              setLogMessages(prev => [...prev, "Balances updated"]);
            }
            setLoadingBalances(false);
        }}
        className='change-specific-sd-ratio'
        name="form-name">
          
        <div className='input-panels'>

          <div className='input-divs-labels'>
            <div className='input-div-label'>Protein: </div>
            <div className='input-div-label'>Energy (kcal): </div>
            <div className='input-div-label'>Fat: </div>
            <div className='input-div-label'>Electricity: </div>
            <div className='input-div-label'>Water: </div>
          </div>

          <div className='input-divs'>
            {[...Array(5).keys()].map(id => (
              <input className='input-text-field' type="text" key={id}
            value={inputNewSpecificSDRatios[id]} onChange={(e) => {
              e.preventDefault();
              //console.log(`old: ${inputNewSpecificSDRatios}`);
              setInputNewSpecificSDRatios(prev => [
                ...prev.slice(0, id),
                e.target.value,
                ...prev.slice(id + 1)
              ]);
              
            }} placeholder='Input new sample SD ratio'/>
            ))}

          </div>

          </div>

          <button type="submit" className='basic-button'>Submit</button>
        </form>
      </div>

      <div className='output-section'>
        <div className='logging'>Logs will appear here</div>
        
        {logMessages.map(msg => <div className='logmsg'>{msg}</div>)}

      </div>

      </div>

      
      



    </div>

    <div className='main-content-section-2'>

      <h2 className='section-2-title'>Visualisation</h2>
      <h3 className='section-2-title-info'>This shows supply / demand ratios for three sample countries: the US, the UK and Canada</h3>

    <div className='image-text-fields'>

      <div className='image-text-field'>
        <div className='image-text'>This displays resource supply / demand ratios, meaning the total supply / total demand for a specific resource.</div>
        <img src='/raw_ratios.png' className='image'></img>
      </div>
        
      <div className='image-text-field'>
        <div className='image-text'>{"This displays the combined / normalized supply / demand ratio, meaning the total supply / total demand (combined). A ratio of 1 means the supply should stay stable. A ratio of <1 means there should be some kind of burning (not yet implemented). A ratio of > 1 means the supply should increase"}.</div>
        <img src='/normalized_supply_demand_ratios.png' className='image'></img>
      </div>
        
    </div>
      
    

    </div>

    </div>
    </>

  );
}

export default App;

