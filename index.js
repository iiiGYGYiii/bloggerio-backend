const http = require("http");
const logger = require("./utils/logger");
const app = require("./app");

const server = http.createServer(app);

server.listen(process.env.PORT || 3001, () =>{
  logger.info(`Server running on PORT: ${process.env.PORT || 3001}`);
});
