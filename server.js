import { spawn } from "child_process";

const port = process.env.PORT || "3001";

const jsonServer = spawn(
  "npx",
  [
    "json-server",
    "db.json",
    "--host",
    "0.0.0.0",
    "--port",
    port
  ],
  {
    stdio: "inherit",
    shell: true
  }
);

jsonServer.on("close", (code) => {
  process.exit(code ?? 0);
});