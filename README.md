# nodejs_15

## 과제

### express 모듈 - response

```
1. res.send(버퍼 또는 문자열 또는 HTML 또는 JSON)
2. res.render('템플릿 파일경로' , {번수}) => 템플릿을 렌더링 한다.
3. res.redirect(주소) => 요청의 경로를 재지정 한다.

```

### express 모듈 - request

```
1. body : req.body.[매개변수] , POST 방식으로 요청한 매개변수 확인
2. params : req.params.[매개변수] , 라우팅 "/products/detail/:id" 에서 id를 추출
3. query : GET 방식으로 요청한 매개변수 확인
```

### express 미들웨어

```
const express = require('express');
const app = express();
app.use()

use() 미들웨어 함수를 사용해서 필요한 요청에 따른 처리를 할 수 있다.
```

### express 미들웨어 - body parser

```
- body parser 미들웨어를 통해 POST 요청을 처리할때 사용자가 보낸 데이터를 추출할 수 있다.
- request 객체에 body 속성이 부여된다.
- app.use(bodyParser.urlencoded({ extended: false }))
=> body parser 미들웨어는 application/x=www-form-unlencoded 인코딩 방식만 지원
- app.use(bodyParser.json())
=> application/json 파싱
```

### express 미들웨어 - router

```
const admin = require("./routes/admin");
const contacts = require("./routes/contacts");
app.use("/admin", admin);
app.use("/contacts", contacts);

- express 앱과 연결
- app.use를 사용하므로 일종의 미들웨어라고 볼 수 있음
- 라우팅 미들웨어 첫번째 인자로 주소를 받음.

const express = require('express');
const router = express.Router();
module.exports = router;

- router 객체는 express.Router()로 만든다
- 마지막 module.exports = router;로 라우터객체를 모듈로 만든다.
- router에도 app처럼 use, get, post, put, patch, delete 같은 메서드를 붙일 수 있다.

```

### 시퀄라이즈 설치

```
- npm i sequelize
- npm i mysql2
- npm i sequelize-cli


<models/index.js>

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
```

### 시퀄라이즈 연결하기

```
- 시퀄라이즈를 통해 익스프레스 앱과 mysql을 연결

<app.js>

const db = require("./models");

db.sequelize.sync();

- sync() 메서드를 사용하면 서버 실행 시 알아서 mysql과 연동된다.
```

### 시퀄라이즈 모델 정의하기

```
- mysql에서 정의한 테이블은 시퀄라이즈에서도 정의해야 한다.
- mysql의 테이블은 시퀄라이즈 모델과 대응된다.

module.exports = function(sequelize, DataTypes) {
  const Products = sequelize.define("Products", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT }
  });

  return Products;
};

- sequelize.define() 메서드로 테이블명과 각 컬럼의 스펙을 입력한다.
- sequelize.define('테이블명', {각 컬럼의 스펙});
```

### 시퀄라이즈 CRUD (생성, 조회, 수정, 삭제)

```
<CREATE>
models.모델명(테이블).create({각 컬럼에 대입 값})
<READ>
models.모델명(테이블).findByPk(기본키값)
models.모델명(테이블).findOne()
models.모델명(테이블).findAll()
<UPDATE>
models.모델명(테이블).update()
<DELETE>
models.모델명(테이블).destroy()
```
