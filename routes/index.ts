import Router from "koa-router";
import user from "./user";
import captcha from "./captcha";

const router = new Router();

router
    .use(user.routes())
    .use(captcha.routes())

export default router