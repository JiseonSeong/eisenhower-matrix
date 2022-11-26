const { jwtMiddleware } = require("../../jwtMiddleware");
const userController = require("../controller/userController");

exports.userRouter = function (app) {
    //회원가입 api
    app.post("/user", userController.signup);

    //로그인 api
    app.post("/sign-in", userController.signin);

    //jwt 검증
    app.get("/jwt", jwtMiddleware, userController.getNicknameByToken);
};