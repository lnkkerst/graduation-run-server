import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import koaStatic from "koa-static";
import views from "koa-views";
import router from "./routes";
import cors from "@koa/cors";
import koaJwt from "koa-jwt";
import redis from "./utils/redis";
import config from "./config";
import sequelize, { Misc, Utils } from "./utils/sequelize";

(async () => {
    try {
        console.log("连接到 Mysql...");
        await sequelize.authenticate();
        await sequelize.sync();
        if (await Misc.findByPk("maxNum") === null) {
            await Misc.create({ id: "maxNum", content: "0" });
        }
    } catch (_e) {
        const e = _e as Error;
        console.error('Mysql 连接失败!', e.message);
        process.exit(1);
    }

    try {
        console.log("连接到 Redis...");
        await redis.connect();
    } catch (_e) {
        const e = _e as Error;
        console.error("Redis 连接失败", e.message);
        process.exit(1);
    }
    
    const app = new Koa();
    require("koa-onerror")(app);

    app.use(bodyParser({
        enableTypes: ["json", "form", "text"]
    }));

    app.use(json());

    app.use(logger());

    app.use(koaStatic(__dirname + "public"));

    app.use(views(__dirname + '/views', {
        extension: "pug"
    }));

    app.use(cors());

    app.use(koaJwt({
        secret: config.koaJwt.secret
    }).unless({
        path: [/^\/auth/]
    }));

    app.use(router.routes());

    app.listen(3000);
    console.log('app started at port 3000...');
})();