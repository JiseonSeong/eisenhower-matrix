const indexDao = require("../dao/indexDao");

exports.createMatrix = async function (req, res) {
    const {user_idx} = req.verifiedToken;
    const {contents, type} = req.body; //token이 있기때문에 user_idx가 필요없음

    /**validation*/
    if (!user_idx || !contents || !type) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: 'ERROR : Input value is missed.',
        })
    }

    //contents 50글자 초과 불가
    if (contents.length > 50){
        return res.send({
            isSuccess: false,
            code: 400,
            message: 'ERROR : Put your contents under 50 letters.',
        })
    }

    //type: do, decide, delete, delegate
    const validTypes = ["do", "decide", "delete", "delegate"];
    if (!validTypes.includes(type)){
        return res.send({
            isSuccess: false,
            code: 400,
            message: 'ERROR : Invalid type.',
        });
    }

    const insertMatrixRow = await indexDao.insertMatrix(user_idx, contents, type)

    if(!insertMatrixRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: 'ERROR : Failed to request. Contact to management.',
        });
    }
    return res.send({
        isSuccess: true,
        code: 200,
        message: 'Success to create user matrix.',
    });
    
};

exports.readMatrix = async function (req, res) {
    //const {user_idx} = req.params;
    const {user_idx} = req.verifiedToken;
    const matrixs = {};
    const types = ["do", "delegate", "delete", "decide"];
    
    for(type of types){
        let selectMatrixByTypeRows = await indexDao.selectMatrixByType(user_idx,type);

        if(!selectMatrixByTypeRows) {
            return res.send({
                isSuccess: false,
                code: 400,
                message: 'ERROR : Failed to read, contact to management.',
            })
        }

        matrixs[type] = selectMatrixByTypeRows;
    }

    
    return res.send({
        result: matrixs,
        isSuccess: true,
        code: 200,
        message: "Success to inquiry."
    });
};

exports.updateMatrix = async function (req, res) {
    const {user_idx} =req.verifiedToken;
    let {matrix_idx, contents, status} = req.body;

    if (!user_idx || !matrix_idx) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : user_idx and matrix_idx are needed.",
        });
    }

    if (!contents) {
        contents = null;
    }

    if (!status) {
        status = null;
    }

    const isValidMatrixRow = await indexDao.selectValidMatrix(user_idx, matrix_idx);

    if (isValidMatrixRow.length <1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : Invalid request. Check user_idx and matrix_idx."
        });
    }
    
    const updateMatrixRow = await indexDao.updateMatrix(user_idx, matrix_idx, contents, status);

    if (!updateMatrixRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : Update failed. Contact to management."
        });
    }

    return res.send({
        result: updateMatrixRow,
        isSuccess: true,
        code: 200,
        message: "Update completed."
    });
};

exports.deleteMatrix = async function (req, res) {
    const {user_idx} = req.verifiedToken;
    const {matrix_idx} = req.params;

    if(!user_idx || !matrix_idx) {
        return res.send({
            isSuccess:false,
            code: 400,
            message: "ERROR : user_idx and matrix_idx are needed."
        })
    }

    const isValidMatrixRow = await indexDao.selectValidMatrix(user_idx, matrix_idx);
    if (isValidMatrixRow.length <1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : Invalid request. Check user_idx and matrix_idx."
        });
    }
    
    const deleteMatrixRow = await indexDao.deleteMatrix(user_idx, matrix_idx);
    if(!deleteMatrixRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "ERROR : Delete failed. Contact to management."
        });
    }
    return res.send({
        isSuccess: true,
        code: 200,
        message: "Success to delete."
    });
};