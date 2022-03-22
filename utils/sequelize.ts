import { Sequelize, Model, DataTypes } from "sequelize";
import config from "../config";

export type UserAttr = {
    sduId: string;
    number: string;
    name: string;
    sex: string;
    campus: string;
    clothingSize: string;
    branch: string;
    phone: string;
    id: string;
    contact: string;
    cPhone: string;
};

export interface UserInstance extends Model<UserAttr>, UserAttr { };

export type MiscAttr = {
    id: string;
    content: string;
};

export interface MiscInstance extends Model<MiscAttr>, MiscAttr { };


const sequelize = new Sequelize(
    config.mysql.dbname,
    config.mysql.username,
    config.mysql.password,
    {
        host: config.mysql.host,
        dialect: "mysql"
    });

export const User = sequelize.define<UserInstance>("user", {
    sduId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    number: DataTypes.STRING,
    name: DataTypes.STRING,
    sex: DataTypes.STRING,
    campus: DataTypes.STRING,
    clothingSize: DataTypes.STRING,
    branch: DataTypes.STRING,
    phone: DataTypes.STRING,
    id: DataTypes.STRING,
    contact: DataTypes.STRING,
    cPhone: DataTypes.STRING
});

export const Misc = sequelize.define<MiscInstance>("misc", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    content: DataTypes.STRING
});

export namespace Utils {
    async function queryConfig(key: string) {
        return await Misc.findByPk(key);
    }
    async function updateConfig(key: string, val: string) {

    }
}

export default sequelize;
