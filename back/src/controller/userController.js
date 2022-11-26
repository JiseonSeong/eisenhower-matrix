const userDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../secret");

//postman으로 쿼리체크하기

exports.signup = async function (req, res) {
    const {email, password, nickname} = req.body;

    if(!email || !password || !nickname) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Check your information. (email, password, nickname)"
        });
    }

    const isValidEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	if(!isValidEmail.test(email)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Check your email format."
        })
    }; 	

    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; //  8 ~자 영문, 숫자, 특수문자 조합
	if(!isValidPassword.test(password)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Check your password format. "
        })
    };

    if(nickname.length < 2 || nickname.length > 20) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Check your nickname. (2-20 letters)"
        })
    };

    //중복 회원 검사
    const isDuplicatedEmail = await userDao.selectUserByEmail(email);
    if(isDuplicatedEmail.length > 0){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Failed to sign up, 이미 가입된 회원입니다"
        });
    };

    //DB입력
    const insertUserRow = await userDao.insertUser(email, password, nickname);
    if(!insertUserRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : Failed to sign up."
        });
    };
    return res.send({
        isSuccess: true,
        code: 200,
        message: "Success to sign up."
    });

    
};

exports.signin = async function (req, res) {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "check the email and password."
        });
    };

    //회원여부 검사
    const isValidUser = await userDao.selectUser(email, password);

    if(!isValidUser) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Database error. Contact to management"
        });
    };

    if(isValidUser.length < 1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "존재하지 않는 회원"
        });
    };

    //jwt토큰 발급
    const [userInfo] = isValidUser;
    const user_idx = userInfo.user_idx;

    const token = jwt.sign(
        {user_idx: user_idx}, //payload
        jwtSecret //secret key
    );
    return res.send({
        result: {token: token},
        isSuccess: true,
        code: 200,
        message: "Success to log in."
    });
};

exports.getNicknameByToken = async function(req, res) {
    const { user_idx } = req.verifiedToken;
    const [userInfo] = await userDao.selectNicknameByUserIdx(user_idx);
    const nickname = userInfo.nickname;

    return res.send({
        result: { nickname: nickname },
        isSuccess: true,
        code: 200,
        message: "Token validation successful",
    });
};