import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';

const config: HardhatUserConfig = {
  defaultNetwork: 'arbitrum',
  networks: {
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts: [`${process.env.DEV_PRIVATE_KEY}`],
      chainId: 42161,
      gasMultiplier: 2,
      deploy: ['deploy/arbitrum'],
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    user1: 1,
  },
  gasReporter: {
    currency: 'USD',
    enabled: false,
  },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
    sources: 'contracts',
    tests: 'test',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
