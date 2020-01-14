# nodejs_15

## 요약

### admin API

```
 - GET /admin/products , 전체 제품 리스트 보여주기
 - GET /admin/products/write , 제품 등록페이지 보여주기
 - POST /admin/products/write , 제품 등록하기
 - GET /admin/products/detail/:id , 해당 제품 상세페이지 보여주기
 - GET /admin/products/edit/:id , 해당 제품 수정하기 보여주기
   * (입력폼에 수정 전 제품정보가 기재)
 - POST /admin/products/edit/:id , 해당 제품 정보 수정하기
 - GET /admin/products/delete/:id , 해당 제품 정보 삭제하기, 댓글도 삭제
 - POST /admin/products/detail/:id , 해당 제품 댓글 등록하기
 - GET  /admin/products/delete/:product_id/:memo_id , 해당 제품 댓글 삭제하기
```

### contacts API

```
 - GET /contacts , 전체 제품 리스트 보여주기
 - GET /contacts/write , 제품 등록페이지 보여주기
 - POST /contacts/write , 제품 등록하기
 - GET /contacts/detail:id , 해당 제품 상세페이지 보여주기
 - GET /contacts/edit/:id , 해당 제품 수정하기 보여주기
 * (입력폼에 수정 전 제품정보가 기재)
 - POST /contacts/edit/:id , 해당 제품 정보 수정하기
 - GET /contacts/delete/:id , 해당 제품 정보 삭제하기
 - POST /contacts/detail/:id , 해당 제품 댓글 등록하기
 - GET  /contacts/delete/:product_id/:memo_id , 해당 제품 댓글 삭제하기
```

### flow

```
 <model>
 - DB(mysql)와 연결 , index.js
 - DB table 컬럼 스펙 정의, define
 - DB table간의 관계 정의
 <control>
 - 각 API에 대한 DB쿼리 로직 구현 , 비동기 await
```

### 시퀄라이즈 모델 관계 정의

```
<models/Products.js>

- DB모델A.associate = models => {
  //모델 관계 정의 로직
  DB모델A.hasMany(DB모델B ,옵션)
}

- 1:N => hasMany ex) 제품 하나의 여러개 댓글이 달리는 경우
- 1:1 => hasOne
- N:M => belongsToMany ex) 해쉬테그
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
- sequelize.define('테이블명', {각 컬럼의 스펙}, {테이블명});
```

### 시퀄라이즈 CRUD (생성, 조회, 수정, 삭제)

```
<CREATE>
models.모델명(테이블).create(데이터)
<READ>
models.모델명(테이블).findByPk(아이디)
models.모델명(테이블).findOne(조건)
models.모델명(테이블).findAll()
<UPDATE>
models.모델명(테이블).update(데이터,조건)
<DELETE>
models.모델명(테이블).destroy(데이터,조건)
```

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

### View

#### Nunjucks

```
- 템플릿 상속
  템플릿 상속은 템플릿을 쉽게 재사용 할 수있는 방법입니다. 템플릿을 작성할 때 하위 템플릿이 무시할 수있는 "블록"을 정의 할 수 있습니다.

  {% extends "parent.html(부모 템플릿)" %}


- 변수
  {{변수}}

- if

  {% if variable %}
  It is true
  {% endif %}

- for

  var items = [{ title: "foo", id: 1 }, { title: "bar", id: 2}];

  <h1>Posts</h1>
  <ul>
  {% for item in items %}
    <li>{{ item.title }}</li>
  {% else %}
    <li>This would display if the 'item' collection were empty</li>
  {% endfor %}
  </ul>

- for in

  {% for fruit, color in fruits %}
  Did you know that {{ fruit }} is {{ color }}?
  {% endfor %}


```

#### HTML form/input/textarea ...

```
<form>
- action : 주소, 비워두면 동적처리
- method : get, post
<input>
- name : 입력값이 name에 정해진 변수명으로 저장 , req.body
- value : 입력창에 보여진다.
```
