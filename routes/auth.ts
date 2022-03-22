import Router from "koa-router";
import svgCaptcha from "svg-captcha";
import jwt from "jsonwebtoken";
import axios from "axios";
import qs from "qs";
import { v4 as uuidv4 } from 'uuid';
import redis from "../utils/redis";
import config from "../config";
import { Model } from "sequelize";
import sequelize, { Misc, MiscInstance, User, UserInstance } from "../utils/sequelize";

const router = new Router();

router.prefix("/auth");

// router.get("/uuid", async (ctx, next) => {
//     ctx.body = {
//         code: 0,
//         data: {
//             uuid: uuidv4()
//         }
//     };
//     await next();
// })

// router.all("/:name(^(?!uuid).*?$)", async (ctx, next) => {
//     if (!("uuid" in ctx.request.query)) {
//         ctx.body = {
//             code: 1,
//             data: {
//                 msg: "No uuid"
//             }
//         }
//     } else {
//         await next();
//     }
// });

// router.post("/:name", async (ctx, next) => {
//     if (!("uuid" in ctx.request.body)) {
//         ctx.body = {
//             code: 1,
//             data: {
//                 msg: "No uuid"
//             }
//         }
//     } else {
//         await next();
//     }
// })

router.get("/captcha", async (ctx, next) => {
    const captcha = svgCaptcha.create({
        background: "white"
    });
    const uuid = uuidv4();
    await redis.set(uuid, captcha.text);
    await redis.expire(uuid, 300);
    ctx.type = "json";
    ctx.body = {
        code: "0",
        data: {
            svg: captcha.data,
            uuid: uuid
        }
    }
    await next();
});

router.post("/user", async (ctx, next) => {
    const captcha = ctx.request.body.captcha as string;
    const username = ctx.request.body.username as string;
    const password = ctx.request.body.password as string;
    const uuid = ctx.request.body.uuid as string;
    if (redis.get(uuid) === null) {
        ctx.body = {
            code: 1,
            data: {
                type: 2,
                msg: "No uuid record"
            }
        }
    }
    if (!username || username.length === 0) {
        ctx.body = {
            code: 1,
            data: {
                type: 2,
                msg: "Invalid username format"
            }
        }
        await next();
        return;
    }
    if (!password || password.length < 8) {
        ctx.body = {
            code: 1,
            data: {
                type: 2,
                msg: "Invalid password format"
            }
        }
        await next();
        return;
    }
    if (captcha.toLowerCase() !== (await redis.get(uuid))
        ?.toLowerCase()) {
        console.log(uuid, await redis.get(uuid), captcha);
        ctx.body = {
            code: 1,
            data: {
                type: 1,
                msg: "Invalid captcha"
            }
        }
        await next();
        return;
    }
    const isduRes = await axios.post(
        "https://sduonline.cn/isduapi/api/auth/login/system",
        qs.stringify({
            u: username,
            p: password
        }));
    if (isduRes.data.code === 0) {
        const token = jwt.sign({
            username: username,
        }, config.koaJwt.secret[0], {
            expiresIn: "240h"
        });
        if ((await User.findByPk(username)) === null) {
            const maxNum = (await Misc.findByPk("maxNum")) as MiscInstance;
            const number = (parseInt(maxNum.content) + 1).toString();
            maxNum.content = number;
            maxNum.save();
            User.create({
                sduId: username,
                number: number,
                name: "",
                id: "",
                sex: "",
                campus: "",
                clothingSize: "",
                branch: "",
                contact: "",
                cPhone: "",
                phone: ""
            });
        }
        ctx.body = {
            code: 0,
            data: {
                token: token
            }
        }
    } else {
        ctx.body = {
            code: 1,
            data: {
                type: 3,
                msg: "Invaild username or password"
            }
        }
    }
    await next();
});

export default router;