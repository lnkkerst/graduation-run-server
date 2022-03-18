import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import koaStatic from "koa-static";
import views from "koa-views";
import router from "./routes";
import cors from "@koa/cors";
import session from "koa-session";
import jwt from "koa-jwt";

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

app.use(jwt({
    secret: Math.random().toString()
}).unless({
    path: [/^\/auth/]
}));

app.use(cors());

app.keys = [Math.random().toString()];

app.use(session({
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    /** (string) session cookie sameSite options (default null, don't set it) */
}, app));

app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');