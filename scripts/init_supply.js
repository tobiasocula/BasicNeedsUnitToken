



const addresses = [
    "0x9966E7692817B333165c93111640Fe4E20988399",
    "0x8f552A85bf0F96E7c1e19BD1b768526DcD6d0D6b",
    "0x6D74324f37770f2672D712761B91C4b5e33642bD",
    "0x5f2668f4CBBaC071501CaC6c1d5bE0EEE1FB1aDd",
    "0x95f3C09092bD7831a839Ea3FD0558cEFbDc50416"
  ]

async function main() {
    const response = await fetch("https://get-balances-4.onrender.com/init-airdrop", {method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                    body: JSON.stringify({ accounts: addresses })
                });
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log('data:', data);
    }
}

main();