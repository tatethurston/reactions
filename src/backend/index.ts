import throng from "throng";
import { PORT, WORKERS } from "./config";

const start = (id: number) => {
  // eslint-disable-next-line
  const server = require("./server").server;
  // eslint-disable-next-line
  server.listen(PORT);
  console.log(`Worker ${id} listening on port ${PORT}`);
};

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start,
});
