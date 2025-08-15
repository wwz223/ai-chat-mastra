import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  deployer: new CloudflareDeployer({
    projectName: "ai-chat-mastra",
    env: {
      CLOUDFLARE_ACCOUNT_ID: "1234567890",
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "",
      CLOUDFLARE_API_EMAIL: "wangweizheng223@gmail.com",
    },
  }),
});
