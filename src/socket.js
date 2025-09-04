// filepath: src/socket.js
import io from "socket.io-client";
import config from "./config";
const socket = io({ path: config.socketUrl });
export default socket;