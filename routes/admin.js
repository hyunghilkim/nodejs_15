const express = require("express");
const router = express.Router();
const models = require("../models");

// GET API /adimin
router.get("/", function(req, res) {
  res.send("admin app kim!!");
});
//  GET API /admin/products
router.get("/products", function(req, res) {
  models.Products.findAll({}).then(products => {
    // DB에서 받은 products를 products변수명으로 내보냄
    res.render("admin/products.html", { products: products });
  });
});
router.get("/products/write", function(req, res) {
  res.render("admin/form.html");
});
router.post("/products/write", function(req, res) {
  models.Products.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }).then(() => {
    res.redirect("/admin/products");
  });
});
router.get("/products/detail/:id", function(req, res) {
  models.Products.findByPk(req.params.id).then(product => {
    res.render("admin/detail.html", { product: product });
  });
});

module.exports = router;
