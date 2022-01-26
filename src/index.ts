import express from "express";
import axios from "axios";
import { createServer } from "http";
import fs from "fs";

const app = express();
const rootRouter = express.Router({ strict: true });
let sha = "";

function getCore() {
  const coreList: any[] = JSON.parse(fs.readFileSync("./core.json").toString());
  const outCoreList = JSON.parse(fs.readFileSync("./out_core.json").toString());
  return coreList.filter(core => !outCoreList.includes(core.id));
}

function setCore(json) {
  fs.writeFileSync("./core.json", JSON.stringify(json));
}

app.get("/api/core", async (req, res) => {
  try {
    const commitRes = await axios.get(
      "https://gitee.com/api/v5/repos/shanzhaikabi/elernal-tree/branches/release",
      {
        timeout: 10000,
      }
    );
    const lastSha = commitRes.data.commit.sha;
    console.log(sha, "sha", lastSha);
    let json = [];
    if (sha != lastSha) {
      sha = lastSha;
      const res = await axios.get(
        `https://gitee.com/shanzhaikabi/elernal-tree/raw/${sha}/data/core.json`,
        {
          timeout: 10000,
        }
      );
      json = res.data;
      setCore(json);
    }
    json = getCore();
    res.send(json);
  } catch (error) {
    let json = [];
    json = getCore();
    res.send(json);
  }
});

const sever = createServer(app);
sever.listen("5006");
