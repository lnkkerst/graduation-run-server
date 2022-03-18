import Router from "koa-router";
import svgCaptcha from "svg-captcha";

const router = new Router();

router.prefix("/captcha");
router.get("/", (ctx, next) => {
    const captcha = svgCaptcha.create();
    ctx.type = "json";
    ctx.body = {
        code: "0",
        data: {
            svg: captcha.data
        }
    }
    ctx.session!.captcha = captcha.text;
});

export default router;