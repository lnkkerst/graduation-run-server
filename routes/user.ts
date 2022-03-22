import { UserInstance } from './../utils/sequelize';
import Router from "koa-router";
import sequelize, { User } from "../utils/sequelize";
import jwt from "jsonwebtoken";

const router = new Router();

router.prefix("/user");

router.all("/:name", async (ctx, next) => {
    ctx.state.token = jwt.decode(ctx.headers.authorization?.split(' ')[1] as string);
    await next();
});

router.get("/info", async (ctx, next) => {
    ctx.body = {
        code: 0,
        data: {
            form: (await User.findByPk(ctx.state.token.username))?.toJSON()
        }
    }
});

router.post("/info", async (ctx, next) => {
    let msg: string = "";
    const body = ctx.request.body as any;
    try {
        if (body.name.length > 100) {
            msg = "姓名内容过长"
        }
        if (body.sex !== "男" && body.sex !== "女") {
            msg = "性别不合法"
        }
        let fl = true;
        for (let i of [
            "中心校区",
            "洪家楼校区",
            "兴隆山校区",
            "趵突泉校区",
            "千佛山校区",
            "软件园校区"
        ]) {
            if (body.campus === i) {
                fl = false;
                break;
            }
        }
        if (fl) {
            msg = "校区字段不合法"
        }
        fl = true;
        for (let i of [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ]) {
            if (body.clothingSize === i) {
                fl = false;
                break;
            }
        }
        if (fl) {
            msg = "衣服尺寸不合法"
        }
        if (body.branch.length > 100) {
            msg = "学院字段过长"
        }
        if (body.phone.length != 11) {
            msg = "手机号长度不是 11 位"
        }
        if (body.id.length != 18) {
            msg = "身份证号长度不合法"
        }
        if (body.contact.length > 100) {
            msg = "紧急联系人字段长度过长"
        }
        if (body.cPhone.length !== 11) {
            msg = "紧急联系人手机号长度不是 11 位"
        }
        if (msg !== "") {
            ctx.response.body = {
                code: 1,
                data: {
                    type: 2,
                    msg: msg
                }
            }
            await next();
            return;
        }
        const user = (await User.findByPk(ctx.state.token.username)) as UserInstance;
        user.branch = body.branch;
        user.cPhone = body.cPhone;
        user.campus = body.campus;
        user.contact = body.contact;
        user.clothingSize = body.clothingSize;
        user.name = body.name;
        user.phone = body.phone;
        user.sex = body.sex;
        user.id =body.id;
        user.save();
        ctx.body = {
            code: 0,
            data: {
                msg: "成功"
            }
        }
    } catch (_e) {
        const e = _e as Error;
        ctx.response.body = {
            code: 1,
            data: {
                type: 3,
                msg: "发生未知错误"
            }
        }
    }
    await next();
});

export default router;