const {pool} = require("../../database");

exports.insertUser = async function(email, password, nickname){
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const insertUserQuery = "insert into Users (email, password, nickname) values (?,?,?);";
            const insertUserParams = [email, password, nickname];

            const [row] = await connection.query(insertUserQuery, insertUserParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### insertUserQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### insertUser DB error ##### \n ${err}`);
        return false;
    } 
};

//중복회원 검사
exports.selectUserByEmail = async function(email) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const selectUserByEmailQuery = "select * from Users where email=?";
            const selectUserByEmailParams = [email];

            const [row] = await connection.query(selectUserByEmailQuery, selectUserByEmailParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### selectUserByEmailQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### selectUserByEmail DB error ##### \n ${err}`);
        return false;
    } 
};

exports.selectUser = async function(email, password) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const selectUserQuery = "select * from Users where email=? and password=?";
            const selectUserParams = [email, password];

            const [row] = await connection.query(selectUserQuery, selectUserParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### selectUserQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### selectUser DB error ##### \n ${err}`);
        return false;
    } 
};

exports.selectNicknameByUserIdx = async function (user_idx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const selectNicknameByUserIdxQuery = "select * from Users where user_idx = ?";
            const selectNicknameByUserIdxParams = [user_idx];

            const [row] = await connection.query(selectNicknameByUserIdxQuery, selectNicknameByUserIdxParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### selectNicknameByUserIdxQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### selectNicknameByUserIdx DB error ##### \n ${err}`);
        return false;
    } 
};