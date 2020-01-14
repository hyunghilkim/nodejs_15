const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");
const admin = require("./routes/admin");
/* const adminAsync = require("./routes/adminAsync"); */
const contacts = require("./routes/contacts");
const app = express();
const port = 3366;
// db 관련
const db = require("./models");
const cookieParser = require("cookie-parser");

nunjucks.configure("template", {
  autoescape: true,
  express: app
});

// 미들웨어 셋팅
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//업로드 path 추가
app.use("/uploads", express.static("uploads"));

// DB authentication
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return db.sequelize.sync();
  })
  .then(() => {
    console.log("DB Sync complete.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.get("/", function(req, res) {
  res.send("first app kim good");
});

app.use("/admin", admin);
app.use("/contacts", contacts);

app.listen(port, function() {
  console.log("kim good good", port);
});
