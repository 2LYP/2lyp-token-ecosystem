# 2LYP Token Hub

2LYP Token Hub is a web dashboard and administration interface for the 2LYP token ecosystem. It provides real-time analytics, distribution and vesting insights, and admin controls for authorized accounts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-%5E15.0-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-%5E18.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-viem-yellowgreen?style=flat)](https://wagmi.sh/)
[![Viem](https://img.shields.io/badge/Viem-%E2%86%92-4CAF50?style=flat)](https://viem.sh/)
[![Recharts](https://img.shields.io/badge/Recharts-%5E2.0-ff6f61?style=flat)](https://recharts.org/)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies and run the development server.

```bash
git clone <repository-url>
cd 2lyp-token-ecosystem
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Open the application at http://localhost:3000

### Notes on usage

- Connect a Web3 wallet (MetaMask or similar) to access wallet-dependent features.
- Admin functionality is visible only when the connected account matches the contract owner; contract-level checks still apply.

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

Branch naming convention:

- Features: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- Chores: `chore/<short-description>`
- Hotfixes: `hotfix/<short-description>`

Please make sure to update or add tests as appropriate.

## Author(s)
Made with ❤️ by 2LYP Computations PVT Ltd

## License

This project is licensed under [MIT](https://choosealicense.com/licenses/mit/). Please refer the license file for more details.
