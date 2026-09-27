require("dotenv").config()


const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Google & Cloudflare DNS
const app = require("./src/app");
const connectDB = require("./src/config/db")
connectDB();



app.listen(3000, () => {
  console.log("server is running")
})