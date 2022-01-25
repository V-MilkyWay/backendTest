import dotenv from 'dotenv';
import Koa from 'koa';
import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';

dotenv.config()
let port = process.env.NODE_ENV === 'production' ? process.env.PORT_PROD : process.env.PORT_DEV;

const app = new Koa();

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  app.listen(port, console.log(port));

  console.log(`Worker ${process.pid} started`);
}
