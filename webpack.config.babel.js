import { webpackDevConfig } from "./configuration/development.js";
import { webpackProdConfig } from "./configuration/production.js";

export default process.env.NODE_ENV?.includes('dev') ? webpackDevConfig : webpackProdConfig;
