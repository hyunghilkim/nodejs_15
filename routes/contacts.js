/************************ 
<CREATE>
models.모델명(테이블).create(데이터)
<READ>
models.모델명(테이블).findByPk(아이디)
models.모델명(테이블).findOne(조건)
models.모델명(테이블).findAll()
<UPDATE>
models.모델명(테이블).update(데이터,조건)
<DELETE>
models.모델명(테이블).destroy(조건)
***************************/

const express = require("express");
const router = express.Router();
const models = require("../models/index.js");

// GET API /contacts , 전체 제품 리스트 보여주기
router.get("/", async function(req, res) {
  try {
    const contactsAll = await models.Contacts.findAll({});
    res.render("contacts/contacts.html", { contacts: contactsAll });
  } catch (e) {}
});

// GET API /contacts/write , 제품 등록페이지 보여주기
router.get("/write", function(req, res) {
  try {
    res.render("contacts/form.html");
  } catch (e) {}
});

// POST API /contacts/write , 제품 등록하기
router.post("/write", async function(req, res) {
  try {
    await models.Contacts.create(req.body);
    res.redirect("/contacts");
  } catch (e) {}
});

// GET API /contacts/detail:id : 해당 제품 상세페이지 보여주기
router.get("/detail/:id", async function(req, res) {
  try {
    const contact = await models.Contacts.findOne({
      where: {
        id: req.params.id
      },
      include: ["Memo"]
    });
    console.log(contact.Memo.id);
    res.render("contacts/detail.html", { contact: contact });
  } catch (e) {}
});

//GET /contacts/edit/:id , 해당 제품 수정하기 보여주기
router.get("/edit/:id", async function(req, res) {
  try {
    const contactOne = await models.Contacts.findByPk(req.params.id);
    res.render("contacts/form.html", { contact: contactOne });
  } catch (e) {}
});

//POST /contacts/edit/:id , 해당 제품 정보 수정하기
router.post("/edit/:id", async function(req, res) {
  try {
    await models.Contacts.update(req.body, {
      where: { id: req.params.id }
    });
    res.redirect(`/contacts/detail/${req.params.id}`);
  } catch (e) {}
});

//GET /contacts/delete/:id , 해당 제품 정보 삭제하기
router.get("/delete/:id", async function(req, res) {
  await models.Contacts.destroy({ where: { id: req.params.id } });
  res.redirect("/contacts");
});

//POST /contacts/detail/:id , 해당 제품 댓글 등록하기
router.post("/detail/:id", async function(req, res) {
  try {
    const contact = await models.Contacts.findByPk(req.params.id);
    await contact.createMemo(req.body);
    res.redirect("/contacts/detail/" + req.params.id);
  } catch (e) {}
});

//GET  /contacts/delete/:product_id/:memo_id , 해당 제품 댓글 삭제하기
router.get("/delete/:contact_id/:memo_id", async function(req, res) {
  try {
    await models.ContactsMemo.destroy({
      where: {
        id: req.params.memo_id
      }
    });
    res.redirect("/contacts/detail/" + req.params.contact_id);
  } catch (e) {}
});

module.exports = router;
