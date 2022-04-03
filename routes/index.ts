import Router from "koa-router";
import user from "./user";
import auth from "./auth";
import admin from "./admin";

const router = new Router();

router
    .use(user.routes())
    .use(auth.routes())
    .use(admin.routes())

export default router