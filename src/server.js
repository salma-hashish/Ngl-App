import { createApp } from "./app.js";
import http from "node:http";
import mongoose from "mongoose";

const app = createApp();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

function shutdown() {
    server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
    });
}

server.on('SIGINT', shutdown);
server.on('SIGTERM', shutdown);

export { app, server };
