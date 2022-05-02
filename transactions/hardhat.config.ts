import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    ganache: {
      url: process.env.GANACHE_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
