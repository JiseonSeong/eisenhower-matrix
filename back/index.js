const compression = require("compression");
const cors = require("cors");
const {indexRouter} = require("./src/router/indexRouter");
const { userRouter } = require("./src/router/userRouter");

const express = require('express');
const app = express();
const port = 3000;

/** express 미들웨어 설정 */

// express가 직접 정적파일 제공
app.use(express.static("front"));

// cors 설정: 
app.use(cors()); //출처를 두지않고 모든사람들이 api를 사용하게 함(보안을 느슨하게?)

// body json 파싱
app.use(express.json());

//HTTP 요청 압축
app.use(compression());


/** 라우터 분리 -> indexRouter.js*/
indexRouter(app);
userRouter(app);


app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`)
});