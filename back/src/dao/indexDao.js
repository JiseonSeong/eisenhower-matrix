const {pool} = require("../../database");
//Dao=Data access object
exports.getUserRows = async function () {
    /**Connect to database */
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        /**실제 query를 날리는 부분 */
        try{
            const selectUserQuery = "SELECT * FROM Users;";

            const [row] = await connection.query(selectUserQuery);

            connection.release(); //mysql과 연결을 끊음 -> 안끊으면 과부화
            return row;

            
        } catch(err) {
            console.err(` ##### getUserRows Query error #####`);
            connection.release();
            return false;
        } /**finally {                 //일일이 try, catch마지막에 커넥션 연결을끊어도되고
            connection.release();        finally문으로 마지막에 넣어도됨
        }*/
    } catch (err) {
        console.error(` ##### getUserRows DB error #####`);
        return false;
    }
};

exports.insertMatrix = async function (user_idx, contents, type) {
    try {
        //db연결 검사 
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const insertMatrixQuery = "insert into Matrix (user_idx, contents, type) values (?, ?, ?);";
            const insertMatrixParams = [user_idx, contents, type];

            const [row] = await connection.query(insertMatrixQuery, insertMatrixParams);

            connection.release(); 
            return row;

            
        } catch(err) {
            console.err(` ##### insertMatrixQuery error ##### \n ${err}`);
            connection.release();
            return false;
        } /**finally {                 //일일이 try, catch마지막에 커넥션 연결을끊어도되고
            connection.release();        finally문으로 마지막에 넣어도됨
        }*/
    } catch (err) {
        console.error(` ##### insertMatrix DB error ##### \n ${err}`);
        return false;
    }
};

exports.selectMatrixByType = async function (user_idx, type){
    try {
        //db연결 검사 
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const selectMatrixByTypeQuery = "select matrix_idx, contents, status from Matrix where user_idx = ? and type= ? and not(status='D');";
            const selectMatrixByTypeParams = [user_idx, type];

            const [row] = await connection.query(selectMatrixByTypeQuery, selectMatrixByTypeParams);

            connection.release(); 
            return row;

            
        } catch(err) {
            console.err(` ##### selectMatrixByTypeQuery error ##### \n ${err}`);
            connection.release();
            return false;
        } /**finally {                 //일일이 try, catch마지막에 커넥션 연결을끊어도되고
            connection.release();        finally문으로 마지막에 넣어도됨
        }*/
    } catch (err) {
        console.error(` ##### selectMatrixByType DB error ##### \n ${err}`);
        return false;
    }
};

exports.selectValidMatrix = async function (user_idx, matrix_idx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const selectValidMatrixQuery = "select * from Matrix where user_idx = ? and matrix_idx = ? and not(status='D');";
            const selectValidMatrixParams = [user_idx, matrix_idx];

            const [row] = await connection.query(selectValidMatrixQuery, selectValidMatrixParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### selectValidMatrixQuery error ##### \n ${err}`);
            connection.release();
            return false;
        } /**finally {                 //일일이 try, catch마지막에 커넥션 연결을끊어도되고
            connection.release();        finally문으로 마지막에 넣어도됨
        }*/
    } catch (err) {
        console.error(` ##### selectValidMatrix DB error ##### \n ${err}`);
        return false;
    } 
};

exports.updateMatrix = async function(user_idx, matrix_idx, contents, status) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const updateMatrixQuery = "update Matrix set contents = ifnull(?, contents), status = ifnull(?, status) where user_idx=? and matrix_idx=?;";
            const updateMatrixParams = [contents, status, user_idx, matrix_idx];

            const [row] = await connection.query(updateMatrixQuery, updateMatrixParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### updateMatrixQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### updateMatrix DB error ##### \n ${err}`);
        return false;
    } 
};

exports.deleteMatrix = async function(user_idx, matrix_idx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try{
            const deleteMatrixQuery = "update Matrix set status = 'D' where user_idx=? and matrix_idx=?;";
            const deleteMatrixParams = [user_idx, matrix_idx];

            const [row] = await connection.query(deleteMatrixQuery, deleteMatrixParams);

            connection.release(); 
            return row;
            
        } catch(err) {
            console.err(` ##### deleteMatrixQuery error ##### \n ${err}`);
            connection.release();
            return false;
        }
    } catch (err) {
        console.error(` ##### deleteMatrix DB error ##### \n ${err}`);
        return false;
    } 
};