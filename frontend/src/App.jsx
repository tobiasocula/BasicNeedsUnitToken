import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { getBalances, increaseSupply, changeSimulationParams, createGraph } from '../backend.js';

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);


function SimulationGridTable({ simulationGrid }) {
  // Extract column headers and rows
  const headers = Object.keys(simulationGrid);
  const numRows = simulationGrid['Year'].length;

  return (
    <table className='table'>
      <thead>
        <tr className='tr'>
          {headers.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: numRows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {headers.map(header => (
              <td className='td' key={header}>{simulationGrid[header][rowIdx]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

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

  const [rawRatiosImg, setRawRatiosImg] = useState(null);
  const [combinedRatiosImg, setCombinedRatiosImg] = useState(null);

  const [simulationGridElec, setSimulationGridElec] = useState({
    'Year': range(2024, 2029),
    'US Electricity Demand': Array(6).fill(10_000),
    'US Electricity Supply': Array(6).fill(10_000),
    'UK Electricity Demand': Array(6).fill(10_000),
    'UK Electricity Supply': Array(6).fill(10_000),
    'CAN Electricity Demand': Array(6).fill(10_000),
    'CAN Electricity Supply': Array(6).fill(10_000),
    'Total Electricity Demand': Array(6).fill(30_000),
    'Total Electricity Supply': Array(6).fill(30_000),
  });
  const [simulationGridWater, setSimulationGridWater] = useState({
    'Year': range(2024, 2029),
    'US Water Demand': Array(6).fill(10_000),
    'US Water Supply': Array(6).fill(10_000),
    'UK Water Demand': Array(6).fill(10_000),
    'UK Water Supply': Array(6).fill(10_000),
    'CAN Water Demand': Array(6).fill(10_000),
    'CAN Water Supply': Array(6).fill(10_000),
    'Total Water Demand': Array(6).fill(30_000),
    'Total Water Supply': Array(6).fill(30_000),
  });
  const [simulationGridProtein, setSimulationGridProtein] = useState({
    'Year': range(2024, 2029),
    'US Protein Demand': Array(6).fill(10_000),
    'US Protein Supply': Array(6).fill(10_000),
    'UK Protein Demand': Array(6).fill(10_000),
    'UK Protein Supply': Array(6).fill(10_000),
    'CAN Protein Demand': Array(6).fill(10_000),
    'CAN Protein Supply': Array(6).fill(10_000),
    'Total Protein Demand': Array(6).fill(30_000),
    'Total Protein Supply': Array(6).fill(30_000),
  });
  const [simulationGridFat, setSimulationGridFat] = useState({
    'Year': range(2024, 2029),
    'US Fat Demand': Array(6).fill(10_000),
    'US Fat Supply': Array(6).fill(10_000),
    'UK Fat Demand': Array(6).fill(10_000),
    'UK Fat Supply': Array(6).fill(10_000),
    'CAN Fat Demand': Array(6).fill(10_000),
    'CAN Fat Supply': Array(6).fill(10_000),
    'Total Fat Demand': Array(6).fill(30_000),
    'Total Fat Supply': Array(6).fill(30_000),
  });
  const [simulationGridKcal, setSimulationGridKcal] = useState({
    'Year': range(2024, 2029),
    'US Kcal (Energy) Demand': Array(6).fill(10_000),
    'US Kcal (Energy) Supply': Array(6).fill(10_000),
    'UK Kcal (Energy) Demand': Array(6).fill(10_000),
    'UK Kcal (Energy) Supply': Array(6).fill(10_000),
    'CAN Kcal (Energy) Demand': Array(6).fill(10_000),
    'CAN Kcal (Energy) Supply': Array(6).fill(10_000),
    'Total Kcal (Energy) Demand': Array(6).fill(30_000),
    'Total Kcal (Energy) Supply': Array(6).fill(30_000),
  });
  const [simulationGridTotal, setSimulationGridTotal] = useState({
    'Year': range(2024, 2029),
    'Electricity Ratios': Array(6).fill(1),
    'Water Ratios': Array(6).fill(1),
    'Protein Ratios': Array(6).fill(1),
    'Fat Ratios': Array(6).fill(1),
    'Kcal (Energy) Ratios': Array(6).fill(1),
    'Total Ratios': Array(6).fill(1)
  });
  

  const [balances, setBalances] = useState([0, 0, 0, 0, 0]);
  const [contractBalance, setContractBalance] = useState(0);

  const [inputNewSupply, setInputNewSupply] = useState("");

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
          <h2 className='input-section-title'>Change total supply of token</h2>
          <div className='text'>Transactions might take some time (every transaction needs to get mined). Don't spam the submit button.</div>

          <div className='input-section-1'>
          
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

      <div className='output-section'>
        <div className='logging'>Logs will appear here</div>
        
        {logMessages.map(msg => <div className='logmsg'>{msg}</div>)}

      </div>

      </div>
    </div>

    <div className='main-content-section-2'>
      <h2>Simulate future resource supply / demand</h2>
      <div className='text'>
        The goal of this section is to show how the supply and demand of certain goods in a few countries would affect the token supply.
      </div>
      <div className='text'>
        Press the button to generate a simulation of how the supply and demand might evolve in the future (randomly generated).
      </div>
      <button type="button" onClick={async () => {
        const res = await changeSimulationParams()
        console.log('result:'); console.log(res);
        setSimulationGridElec({
          'Year': range(2024, 2029),
          'US Electricity Demand': res.val['US Elec Demand'],
          'US Electricity Supply': res.val['US Elec Supply'],
          'UK Electricity Demand': res.val['UK Elec Demand'],
          'UK Electricity Supply': res.val['UK Elec Supply'],
          'CAN Electricity Demand': res.val['CAN Elec Demand'],
          'CAN Electricity Supply': res.val['CAN Elec Supply'],
          'Total Electricity Demand': res.val['Total Elec Demand'],
          'Total Electricity Supply': res.val['Total Elec Supply'],
        });

      }} className="basic-button">New</button>
      <div className='table-section'>
        Electricity supply & demand
        <SimulationGridTable simulationGrid={simulationGridElec} />
      </div>
      <div className='table-section'>
        Water supply & demand
        <SimulationGridTable simulationGrid={simulationGridWater} />
      </div>
      <div className='table-section'>
        Protein (in food) supply & demand
        <SimulationGridTable simulationGrid={simulationGridProtein} />
      </div>
      <div className='table-section'>
        Fat (in food) supply & demand
        <SimulationGridTable simulationGrid={simulationGridFat} />
      </div>
      <div className='table-section'>
        Kcal (food energy) supply & demand
        <SimulationGridTable simulationGrid={simulationGridKcal} />
      </div>
      <div className='table-section'>
        {"Supply & Demand ratios (>1 means supply > demand, <1 means supply < demand)"}
        <SimulationGridTable simulationGrid={simulationGridTotal} />
      </div>

      <button className='submit-data' type="button" onClick={async () => {
        const res = await createGraph([
          simulationGridElec,
          simulationGridWater,
          simulationGridProtein,
          simulationGridFat,
          simulationGridKcal,
          simulationGridTotal,
        ]);
        console.log('result:'); console.log(res);
        //setRawRatiosImg(res.val.image);


      }}>Create graph</button>
    
    </div>

    <div className='main-content-section-3'>

      <h2 className='section-2-title'>Visualisation (past resources)</h2>
      <h3 className='section-2-title-info'>This shows supply / demand ratios for three sample countries: the US, the UK and Canada</h3>
      <h4 className='section-2-title-info'>This data is pregenerated from fetched data</h4>

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

    <div className='main-content-section-4'>
      <h2 className='section-2-title'>Visualisation (data from simulation)</h2>
      <h3 className='section-2-title-info'>This shows supply / demand ratios for three sample countries: the US, the UK and Canada</h3>
      <h4 className='section-2-title-info'>This data comes from the simulated future supply & demand values (see above)</h4>

      <div className='image-text-fields'>

        {rawRatiosImg ? (
          <>
            <div className='data-img'>
          <div className='image-text'>This displays resource supply / demand ratios, meaning the total supply / total demand for a specific resource.</div>
          <img src={rawRatiosImg} alt="rawratiosim" />
        </div>

        <div className='data-img'>
          <div className='image-text'>This displays resource supply / demand ratios, meaning the total supply / total demand for a specific resource.</div>
          <img src={combinedRatiosImg} alt="rawratiosim" />
        </div>
          </>
        ) : (
          <div className='no-data-yet-text'>Press the 'Generate Graph' button for data plotting</div>
        )}

        

      </div>

    </div>

    </div>
    </>

  );
}

export default App;

