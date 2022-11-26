const { jwtMiddleware } = require("../../jwtMiddleware.js");
const indexController = require("../controller/indexController.js");

exports.indexRouter = function (app) {
    /**CRUD api */
    app.post("/matrix", jwtMiddleware, indexController.createMatrix); //create
    app.get("/matrixs", jwtMiddleware, indexController.readMatrix); //일정조회 : 1번유저의 일정을 출력
    app.patch("/matrix", jwtMiddleware, indexController.updateMatrix); //update
    app.delete("/matrix/:matrix_idx", jwtMiddleware, indexController.deleteMatrix); //delete, /user/1/matrix/1

};

