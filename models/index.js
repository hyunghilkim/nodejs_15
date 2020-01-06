const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config(); //LOAD CONFIG

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: "3307",
    dialect: "mysql",
    timezone: "+09:00", //한국 시간 셋팅
    operatorsAliases: Sequelize.Op,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

let db = [];

//나중에 모델 폴더에 index.js를 제외한 각 테이블별로 연동되는 js파일이 존재하게 될 것이다
//index.js를 제외하고 나머지를 싹 다 실행 시켜주는 기능 => 각각의 테이블 들이 자동 생성된다.
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf(".js") && file !== "index.js";
  })
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
