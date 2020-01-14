const express = require("express");
const router = express.Router();
const models = require("../models");

// GET API /adimin
router.get("/", (req, res) => {
  res.send("admin app kim!!");
});

//  GET API /admin/products , 제품 리스트 보여주기
router.get("/products", (req, res) => {
  models.Products.findAll({}).then(products => {
    // DB에서 받은 products를 products변수명으로 내보냄
    res.render("admin/products.html", { products: products });
  });
});

// GET /products/write , 제품 등록페이지 보여주기
router.get("/products/write", (req, res) => {
  res.render("admin/form.html");
});

// POST /products/write , 제품 등록하기 페이지
router.post("/products/write", (req, res) => {
  models.Products.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }).then(() => {
    res.redirect("/admin/products");
  });
});

//GET /products/detail/:id , 제품 상세페이지 보여주기
router.get("/products/detail/:id", (req, res) => {
  models.Products.findByPk(req.params.id).then(product => {
    res.render("admin/detail.html", { product: product });
  });
});

//GET /products/edit/:id , 제품 수정하기 보여주기 (입력폼에 수정 전 제품정보가 기재)
router.get("/products/edit/:id", (req, res) => {
  models.Products.findByPk(req.params.id).then(product => {
    res.render("admin/form.html", { product: product });
  });
});

// POST API /admin/products/edit/:id , 제품 정보 수정하기
router.post("/products/edit/:id", (req, res) => {
  models.Products.update(
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    },
    {
      where: { id: req.params.id }
    }
  ).then(() => {
    res.redirect(`/admin/products/detail/${req.params.id}`);
  });
});

// GET /admin/products/delete/:id , 제품 정보 삭제하기
router.get("/products/delete/:id", (req, res) => {
  models.Products.destroy({ where: { id: req.params.id } }).then(() => {
    res.redirect("/admin/products");
  });
});

module.exports = router;
