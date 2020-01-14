const express = require("express");
const router = express.Router();
const models = require("../models");

//미들웨어
function testMiddleWare(req, res, next) {
  console.log("미들웨어 작동");
  next();
}
function testMiddleWare2(req, res, next) {
  console.log("미들웨어2 작동");
  next();
}
// csrf 셋팅
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

// GET API /adimin , test
router.get("/", testMiddleWare, (_, res) => {
  res.send("admin app kim!!");
});

//  GET API /admin/products , 제품 리스트 보여주기
router.get("/products", async (req, res) => {
  try {
    // DB에서 받은 productsList를 products변수명으로 내보냄
    const productsList = await models.Products.findAll({});
    res.render("admin/products.html", { products: productsList });
  } catch (e) {}
});

// GET /products/write , 제품 등록페이지 보여주기
router.get("/products/write", (req, res) => {
  res.render("admin/form.html");
});
// POST /products/write , 제품 등록하기 페이지
router.post("/products/write", async (req, res) => {
  console.log(req.body);
  console.log("뭘까");
  try {
    await models.Products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    });
    res.redirect("/admin/products");
  } catch (e) {}
});

//GET /products/detail/:id , 제품 상세페이지 보여주기
router.get("/products/detail/:id", async (req, res) => {
  try {
    /* const product = await models.Products.findByPk(req.params.id); */
    const product = await models.Products.findOne({
      where: {
        id: req.params.id
      },
      include: ["Memo"]
    });
    res.render("admin/detail.html", { product: product });
  } catch (e) {}
});

//GET /products/edit/:id , 제품 수정하기 보여주기 (입력폼에 수정 전 제품정보가 기재)
router.get("/products/edit/:id", async (req, res) => {
  try {
    const productOne = await models.Products.findByPk(req.params.id);
    res.render("admin/form.html", {
      product: productOne
    });
  } catch (e) {}
});

// POST API /admin/products/edit/:id , 제품 정보 수정하기
router.post("/products/edit/:id", async (req, res) => {
  try {
    await models.Products.update(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
      },
      {
        where: { id: req.params.id }
      }
    );
    res.redirect(`/admin/products/detail/${req.params.id}`);
  } catch (e) {}
});

// GET /admin/products/delete/:id , 제품 정보 삭제하기
router.get("/products/delete/:id", async (req, res) => {
  await models.Products.destroy({ where: { id: req.params.id } });
  res.redirect("/admin/products");
});

// POST /admin/products/detail/:id , 제품 댓글 등록하기
router.post("/products/detail/:id", async (req, res) => {
  try {
    console.log(req.body);
    const product = await models.Products.findByPk(req.params.id);
    // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
    await product.createMemo(req.body);
    res.redirect("/admin/products/detail/" + req.params.id);
  } catch (e) {
    console.log(e);
  }
});

//GET  /admin/products/delete/:product_id/:memo_id , 댓글 삭제하기
router.get("/products/delete/:product_id/:memo_id", async (req, res) => {
  try {
    await models.ProductsMemo.destroy({
      where: {
        id: req.params.memo_id
      }
    });
    res.redirect("/admin/products/detail/" + req.params.product_id);
  } catch (e) {}
});

module.exports = router;
