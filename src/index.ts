import express from 'express';
import axios from 'axios';
import { createServer } from 'http';

const app = express();
const rootRouter = express.Router({ strict: true });

app.get('/api/core', async (req, res) => {
   try {
    const commitRes = await axios.get('https://gitee.com/api/v5/repos/shanzhaikabi/elernal-tree/commits');
    const data = commitRes.data;
    const lastCommit = data[0];
    const json = await axios.get(`https://gitee.com/shanzhaikabi/elernal-tree/raw/${lastCommit.sha}/data/core.json`);
    res.send(json.data);
   } catch (error) {
       res.send([]);
   }
});

const sever = createServer(app);
sever.listen('5006');