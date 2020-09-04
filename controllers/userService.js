//mysqlConfig.js
var mysql = require('mysql');
var config = require('./defaultConfig');

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    timezone: "08:00"
});

let allServices = {
    query: function (sql, values) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {

                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })

    },
   findUserData: function (name) {
        let _sql = `select * from users where name="${name}";`
        return allServices.query(_sql)
    },
    addUserData: (obj) => {
        // console.log(obj)
         let _sql = `insert into user (account,password,nickname) values("${obj.account}","${obj.password}","${obj.nickname}");`
         return allServices.query(_sql)
     },
     addArticle: (obj) => {
        // console.log(obj)
         let _sql = `insert into article (title,description,content,uid,createTime,classify) values("${obj.title}","${obj.description}","${obj.content}","${obj.uid}","${obj.createTime}","${obj.classify}");`
         return allServices.query(_sql)
     },
}

module.exports = allServices;