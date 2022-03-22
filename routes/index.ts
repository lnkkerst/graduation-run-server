import Router from "koa-router";
import user from "./user";
import auth from "./auth";

const router = new Router();

router
    .use(user.routes())
    .use(auth.routes())

export default router