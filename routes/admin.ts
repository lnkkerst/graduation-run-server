import { UserInstance } from './../utils/sequelize';
import Router from "koa-router";
import sequelize, { User } from "../utils/sequelize";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Parser as CSVParser } from "json2csv";
const router = new Router();

const csvParser = new CSVParser({
    fields: [
        "sduId",
        "number",
        "name",
        "sex",
        "campus",
        "clothingSize",
        "branch",
        "phone",
        "id",
        "contact",
        "cPhone",
        "signup"
    ]
});

router.prefix("/admin");

router.all("/:name", async (ctx, next) => {
    ctx.state.token = jwt.decode(ctx.headers.authorization?.split(' ')[1] as string);
    await next();
});

router.get("/info/amount", async (ctx, next) => {
    try {
        const oriWhere = JSON.parse(ctx.request.query.where as string) as { kId: string, items: string[] }[];

        const where = {} as any;
        for (let i of oriWhere) {
            where[i.kId] = {
                [Op.or]: i.items
            }
        }
        ctx.type = "json";
        ctx.body = {
            code: 0,
            data: {
                amount: await User.count({
                    where: {
                        [Op.and]: where
                    }
                })
            }
        }
        await next();
    } catch (_e) {
        const e = _e as Error;
        ctx.response.body = {
            code: 1,
            data: {
                type: 4,
                message: "Invaild request format"
            }
        };
    } finally {

    }
});


router.get("/info/details", async (ctx, next) => {
    try {
        const offset = parseInt(ctx.request.query.offset as string);
        const limit = parseInt(ctx.request.query.limit as string);
        const oriWhere = JSON.parse(ctx.request.query.where as string) as { kId: string, items: string[] }[];

        if (offset < 0 || limit <= 0) {
            throw new Error("Invaild offset or limit");
        }

        const where = {} as any;
        for (let i of oriWhere) {
            where[i.kId] = {
                [Op.or]: i.items
            }
        }
        ctx.response.body = {
            code: 0,
            data: {
                info: await User.findAll({
                    offset: offset,
                    limit: limit,
                    where: {
                        [Op.and]: where
                    }
                }),
            }
        }
        await next();
    } catch (_e) {
        const e = _e as Error;
        ctx.response.body = {
            code: 1,
            data: {
                type: 4,
                message: "Invaild request format"
            }
        };
    } finally {

    }
});

router.get("/info/csv", async (ctx, next) => {
    try {
        ctx.type = "text/csv";
        ctx.set("Content-Disposition", "attachment; filename=" + "table.csv");
        ctx.body = csvParser.parse(await User.findAll());
        await next();
    } catch (_e) {

    }
})

router.get("/info/json", async (ctx, next) => {
    try {
        ctx.type = "json";
        ctx.body = await User.findAll();
        await next();
    } catch (_e) {

    }
})

export default router;
