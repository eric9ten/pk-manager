const express = require('express');
const router = express.Router();
const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router.post(
  '/auth/signup',
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  controller.signup
);

router.post('/auth/signin', controller.signin);

router.post('/auth/signout', controller.signout);

router.post('/auth/refreshtoken', controller.refreshToken);

module.exports = router;