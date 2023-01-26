import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const HARVESTERS = {
  Afarit: '0x70a75ac9537f6cdac553f82b6e39484acc521067',
  Asiterra: '0x88bf661446c8f5a7072c0f75193dae0e18ae40bc',
  Kameji: '0xdf9f9ca6ee5c3024b64dcecbadc462c0b896147a',
  LupusMagus: '0x3fbfcdc02f649d5875bc9f97281b7ef5a7a9c491',
  Shinoba: '0x2b1de6d22e6cb9178b3ecbcb7f20b62fcce925d4',
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, run } = hre;
  const { deploy, read } = deployments;
  const { deployer } = await getNamedAccounts();

  for await (const [name, address] of Object.entries(HARVESTERS)) {
    const CONTRACT_NAME = `Verify${name}Access`;

    const verifyAccess = await deploy(CONTRACT_NAME, {
      from: deployer,
      log: true,
      proxy: {
        owner: deployer,
        proxyContract: 'OpenZeppelinTransparentProxy',
        execute: {
          init: {
            methodName: 'initialize',
            args: [address],
          },
        },
      },
    });

    const DefaultProxyAdmin = await deployments.get('DefaultProxyAdmin');

    const entries = [
      { name: 'DefaultProxyAdmin.address', value: DefaultProxyAdmin.address },
      {
        name: `DefaultProxyAdmin.getProxyAdmin("${CONTRACT_NAME}")`,
        value: await read(
          'DefaultProxyAdmin',
          'getProxyAdmin',
          verifyAccess.address,
        ),
      },
      {
        name: 'DefaultProxyAdmin.owner()',
        value: await read('DefaultProxyAdmin', 'owner'),
      },
    ];

    console.log(`---- ${CONTRACT_NAME} Config ----`);
    console.table(entries);

    try {
      await run('etherscan-verify');
    } catch (error) {
      console.log(`Error verifying: ${error}`);
    }
  }
};

export default func;

func.tags = ['deployments'];
