
export default {
    // redis 的 url, 不填则采用本地默认值
    redis: {
        url: ""
    },
    // mysql 相关
    mysql: {
        host: "localhost:3306",
        username: "root",
        password: "",
        dbname: "graduation_run",
    },
    // 跨域访问控制
    cors: {
        allowedAll: true,
        allows: [] as string[]
    },
    // kwt 鉴权
    koaJwt: {
        secret: ["114514"]
    }
}