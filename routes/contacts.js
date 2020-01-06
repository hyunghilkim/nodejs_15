/************************ 
<생성>
models.모델명(테이블).create
<조회>
models.모델명(테이블).findByPk
models.모델명(테이블).findOne 
models.모델명(테이블).findAll
<수정>
models.모델명(테이블).update
<삭제>
models.모델명(테이블).destroy
***************************/

const express = require("express");
const router = express.Router();
const models = require("../models");

// GET API /contacts : 글 리스트 보기
router.get("/", function(req, res) {
  models.Contacts.findAll({}).then(contacts => {
    res.render("contacts/contacts.html", { contacts: contacts });
  });
});

// GET API /contacts/write : 글 작성 폼 보기
router.get("/write", function(req, res) {
  res.render("contacts/form.html");
});

// POST API /contacts/write : 글 작성 하기
router.post("/write", function(req, res) {
  models.Contacts.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }).then(() => {
    res.redirect("/contacts");
  });
});
// GET API /contacts/detail:id : 상게 글 보기
router.get("/detail/:id", function(req, res) {
  models.Contacts.findByPk(req.params.id).then(contact => {
    res.render("contacts/detail.html", { contact: contact });
  });
});

module.exports = router;
