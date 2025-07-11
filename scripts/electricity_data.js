
// this is a sample script showcasing the potential to increase token supply based on new electricity data (supply & demand)
// coming from an api
// later: implement oracle to fetch data on-chain
// this is just a demo script

require("dotenv").config();
const ethers = require("ethers");
const artifact = require('../artifacts/contracts/BasicNeedsUnitToken.sol/BasicNeedsUnitToken.json');

const { increaseSupply } = require('../frontend/backend.js');

const tokenAddress = "0xE8a23AB5b39F5FD1B00912B36c43fAfFD148e593"; // proxy

async function fetchData(year, month, country, demand) {
    let url;
    // if (month[0] === "0") {
    //     url = `https://api.ember-energy.org/v1/electricity-demand/monthly?entity_code=${country}&is_aggregate_series=false&start_date=${year}-${month}&end_date=${year}-0${(parseInt(month[1])+1).toString()}&api_key=${process.env.EMBER_API_KEY}`;
    // } else {
    //     url = `https://api.ember-energy.org/v1/electricity-demand/monthly?entity_code=${country}&is_aggregate_series=false&start_date=${year}-${month}&end_date=${year}-${(parseInt(month)+1).toString()}&api_key=${process.env.EMBER_API_KEY}`;
    // }
    if (month[0] === "0") {
        url = `https://api.ember-energy.org/v1/electricity-${demand ? "demand" : "generation"}/monthly?entity_code=${country}&is_aggregate_series=false&start_date=${year}-0${(parseInt(month[1])-1).toString()}&api_key=${process.env.EMBER_API_KEY}`;
    } else {
        url = `https://api.ember-energy.org/v1/electricity-demand/monthly?entity_code=${country}&is_aggregate_series=false&start_date=${year}-${(parseInt(month[1])-1).toString()}&api_key=${process.env.EMBER_API_KEY}`;
    }

    const response = await fetch(url);
    if (response.status === 200) {
        const data = await response.json();
        console.log('all data:', data.data);
        return data.data;
    } else {
        throw new Error("");
    }

}

async function main() {

    const queryYear = "2025";
    const queryMonth = "02";

    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);

    const latestDateContract = await contract.latestDataTime(); // bigint

    const usaDemand = await fetchData(queryYear, queryMonth, "USA", true);
    const ukDemand = await fetchData(queryYear, queryMonth, "GBR", true);
    const canDemand = await fetchData(queryYear, queryMonth, "CAN", true);

    const usaSupply = await fetchData(queryYear, queryMonth, "USA", false);
    const ukSupply = await fetchData(queryYear, queryMonth, "GBR", false);
    const canSupply = await fetchData(queryYear, queryMonth, "CAN", false);

    // demand dates
    const usaLatestDateDemand = usaDemand[usaDemand.length-1].date.split('-');
    let usaDateDemand = new Date(usaLatestDateDemand[0], usaLatestDateDemand[1]).valueOf();
    const ukLatestDateDemand = ukDemand[ukDemand.length-1].date.split('-');
    let ukDateDemand = new Date(ukLatestDateDemand[0], ukLatestDateDemand[1]).valueOf();
    const canLatestDateDemand = canDemand[canDemand.length-1].date.split('-');
    let canDateDemand = new Date(canLatestDateDemand[0], canLatestDateDemand[1]).valueOf();

    // supply dates
    const usaLatestDateSupply = usaSupply[usaSupply.length-1].date.split('-');
    let usaDateSupply = new Date(usaLatestDateSupply[0], usaLatestDateSupply[1]).valueOf();
    const ukLatestDateSupply = ukSupply[ukSupply.length-1].date.split('-');
    let ukDateSupply = new Date(ukLatestDateSupply[0], ukLatestDateSupply[1]).valueOf();
    const canLatestDateSupply = canSupply[canSupply.length-1].date.split('-');
    let canDateSupply = new Date(canLatestDateSupply[0], canLatestDateSupply[1]).valueOf();

    let usaIndexDemand = usaDemand.length-1;
    let ukIndexDemand = ukDemand.length-1;
    let canIndexDemand = canDemand.length-1;

    let usaIndexSupply = usaSupply.length-1;
    let ukIndexSupply = ukSupply.length-1;
    let canIndexSupply = canSupply.length-1;

    let minDate = Math.min(usaDateDemand, usaDateSupply, ukDateDemand, ukDateSupply, canDateDemand, canDateSupply);

    // find latest date that all have in common
    while (
        !(
            (usaDateDemand == ukDateDemand) && (ukDateDemand == canDateDemand)
            &&
            (usaDateSupply == ukDateSupply) && (ukDateSupply == canDateSupply)
        )
        &&
        (canIndexDemand !== 0 && ukIndexDemand !== 0 && usaIndexDemand !== 0
            && canIndexSupply !== 0 && ukIndexSupply !== 0 && usaIndexSupply !== 0
        )
    ) {
        if (minDate !== usaDateDemand) {
            usaIndexDemand--;
            usaDateDemand = new Date(
                usaDemand[usaIndexDemand].date.split('-')[0],
                usaDemand[usaIndexDemand].date.split('-')[1]
            ).valueOf();
        } else if (minDate !== usaDateSupply) {
            usaIndexSupply--;
            usaDateSupply = new Date(
                usaSupply[usaIndexSupply].date.split('-')[0],
                usaSupply[usaIndexSupply].date.split('-')[1]
            ).valueOf();
        } else if (minDate !== ukDateDemand) {
            ukIndexDemand--;
            ukDateDemand = new Date(
                ukDemand[ukIndexDemand].date.split('-')[0],
                ukDemand[ukIndexDemand].date.split('-')[1]
            ).valueOf();
        } else if (minDate !== ukDateSupply) {
            ukIndexSupply--;
            ukDateSupply = new Date(
                ukSupply[ukIndexSupply].date.split('-')[0],
                ukSupply[ukIndexSupply].date.split('-')[1]
            ).valueOf();
        } else if (minDate !== canDateDemand) {
            canIndexDemand--;
            canDateDemand = new Date(
                canDemand[canIndexDemand].date.split('-')[0],
                canDemand[canIndexDemand].date.split('-')[1]
            ).valueOf();
        } else {
            canIndexSupply--;
            canDateSupply = new Date(
                canSupply[canIndexSupply].date.split('-')[0],
                canSupply[canIndexSupply].date.split('-')[1]
            ).valueOf();
        }
    }
    // console.log(usaDemand[usaIndexDemand]);
    // console.log(ukDemand[ukIndexDemand]);
    // console.log(canDemand[canIndexDemand]);
    // console.log(usaSupply[usaIndexSupply]);
    // console.log(ukSupply[ukIndexSupply]);
    // console.log(canSupply[canIndexSupply]);

    const totalDemand = usaDemand[usaIndexDemand].demand_twh + ukDemand[ukIndexDemand].demand_twh + canDemand[canIndexDemand].demand_twh;
    const totalSupply = usaSupply[usaIndexSupply].generation_twh + ukSupply[ukIndexSupply].generation_twh + canSupply[canIndexSupply].generation_twh;

    if (!latestDateContract) {
        const tx = await contract.provideElecData(Math.round(totalDemand), Math.round(totalSupply));
        await tx.wait();
        
        const latestElecDemand = await contract.latestElecDemand();
        const latestElecSupply = await contract.latestElecSupply();
        const latestRatio = latestElecSupply / latestElecDemand;
        const newRatio = totalSupply / totalDemand;
        const pctIncrease = newRatio / latestRatio - 1;
        if (pctIncrease >= 0) {
            // increase supply by pctIncrease
            const res = await increaseSupply(pctIncrease);
            if (res.status) {
                console.log('success!');
            } else {
                throw new Error(`something went wrong: ${res.msg}`);
            }
        } else {
            console.log('burning tokens not implemented yet');
        }
        
    } else {

        if (
            new Date(
                usaDemand[usaIndexDemand].date.slice('-')[0],
                usaDemand[usaIndexDemand].date.slice('-')[1]
            ) >= latestDateContract + BigInt(3600 * 24 * 30)
            &&
            new Date(
                ukDemand[ukIndexDemand].date.slice('-')[0],
                ukDemand[ukIndexDemand].date.slice('-')[1]
            ) >= latestDateContract + BigInt(3600 * 24 * 30)
            &&
            new Date(
                canDemand[canIndexDemand].date.slice('-')[0],
                canDemand[canIndexDemand].date.slice('-')[1]
            ) >= latestDateContract + BigInt(3600 * 24 * 30)
            &&
            new Date(
                ukSupply[ukIndexSupply].date.slice('-')[0],
                ukSupply[ukIndexSupply].date.slice('-')[1]
            ) >= latestDateContract + 3600 * 24 * 30
            &&
            new Date(
                usaSupply[usaIndexSupply].date.slice('-')[0],
                usaSupply[usaIndexSupply].date.slice('-')[1]
            ) >= latestDateContract + BigInt(3600 * 24 * 30)
            &&
            new Date(
                canSupply[canIndexSupply].date.slice('-')[0],
                canSupply[canIndexSupply].date.slice('-')[1]
            ) >= latestDateContract + BigInt(3600 * 24 * 30)
        ) {
            // enough time has passed
            const tx = await contract.provideElecData(Math.round(totalDemand), Math.round(totalSupply));
            await tx.wait();

            const latestElecDemand = await contract.latestElecDemand();
            const latestElecSupply = await contract.latestElecSupply();
            const latestRatio = latestElecSupply / latestElecDemand;
            
            const newRatio = totalSupply / totalDemand;
            const pctIncrease = newRatio / latestRatio - 1;
            if (pctIncrease >= 0) {
                // increase supply by pctIncrease
                const res = await increaseSupply(pctIncrease);
                if (res.status) {
                    console.log('success!');
                } else {
                    throw new Error(`something went wrong: ${res.msg}`);
                }
            } else {
                console.log('burning tokens not implemented yet');
            }

        } else {
            console.log('not enough time passed!');
        }

    }
}
main();