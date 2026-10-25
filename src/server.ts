import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/prisma.js";
import os from "os";

const port = Number(process.env.PORT || 3000);

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const nets of Object.values(interfaces)) {
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};

const server = app.listen(port, () => {
  const ip = getLocalIP();
  console.log(`  Local:   http://localhost:${port}`);
  console.log(`  Network: http://${ip}:${port}`);
});

async function shutdown(signal: string) {
  console.info(`${signal} received; shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
