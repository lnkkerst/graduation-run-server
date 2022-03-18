import Router from "koa-router";

const router = new Router();

router.prefix("/user");

router.get("/", (ctx, next) => {
    ctx.type = "json";
    ctx.body = JSON.stringify({ name: "user" });
})

export default router;