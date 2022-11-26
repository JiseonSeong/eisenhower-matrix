//const { createMatrix } = require("../../node/src/controller/indexController");

readMatrix();

//일정 조회 기능 구현
async function readMatrix() {
    const token = localStorage.getItem("x-access-token");
    if(!token) {
        return;
    }

    //일정 조회(indexRouter.js) api호출
    const config = {
        method: "get",
        url: url + "/matrixs",
        headers: { "x-access-token": token},
    };

    try {
        const res = await axios(config);
        if (res.data.isSuccess !== true) {
            alert(res.data.message);
            return false;
        }

        const matrixDataSet = res.data.result;
        //console.log(matrixDataSet);
        for (let section in matrixDataSet) {
            //console.log(section);

            //각 섹션의 ul태그 선택
            const sectionUl = document.querySelector(`#${section} ul`);

            //각 섹션에 해당하는 데이터
            const arrayForEachSection = matrixDataSet[section];
            //console.log(arrayForEachSection);

            let result = "";
            for (let matrix of arrayForEachSection) {
                let element = `
                <li class="list-item" id=${matrix.matrix_idx}>
                    <div class="done-text-container">
                        <input type="checkbox" class="matrix-done" ${matrix.status ==='C' ? "checked" : ""} />
                        <p class="matrix-text">${matrix.contents}</p>
                    </div>
                    <div class="update-delete-container">
                        <i class="matrix-update fa-sharp fa-solid fa-pencil"></i>
                        <i class="matrix-delete fa-solid fa-trash-can"></i>
                    </div>
                </li>
                `;

                result += element;
            }
            sectionUl.innerHTML = result;
        }
        
    } catch (err) {
        console.error(err);
    }
}

//일정 CUD
const matrixContainer = document.querySelector(".matrix-container");
//엔터키 감지
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);

function cudController(event) {
    const token = localStorage.getItem("x-access-token");
    if(!token) {
        return;
    }

    const target = event.target;
    const targetTagName = target.tagName;
    const eventType = event.type;
    const key = event.key;

    console.log(target, targetTagName, eventType, key);

    //create 이벤트 처리
    if(targetTagName === "INPUT" && key === "Enter") {
        createMatrix(event, token);
        return; //함수를 빨리 끝낼 수 있게 함
    }

    // ####### update 이벤트 처리

    //check box 업데이트
    if(target.className === "matrix-done" && eventType === "click") {
        updateMatrixDone(event, token);
        return;
    }

    //contents 업데이트
    const firstClassName = target.className.split(" ")[0];
    if (firstClassName === "matrix-update" && eventType === "click") {
        updateMatrixContents(event, token);
        return;
    }

    //delete 이벤트 처리
    if (firstClassName === "matrix-delete" && eventType === "click") {
        deleteMatrix(event, token);
        return;
    }

}

async function createMatrix(event, token){
    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id; //closest(선택자): 선택자에 부합하는 가장 가까운 부모요소 반환
    
    if(!contents) {
        alert("Put contents.");
        return false;
    }

    const config = {
        method: "post",
        url: url + "/matrix",
        headers: {"x-access-token": token},
        data: {
            contents: contents,
            type: type,
        },
    };

    try{
        const res = await axios(config);

        if(res.data.isSuccess !== true) {
            alert(Res.data.message);
            return false;
        }

        //DOM 업데이트
        readMatrix();
        event.target.value = ""; //할일을 추가했을 때, input 값 초기화
        return true; 

    } catch (err) {
        console.error(err);
        return false;
    }
    
}; 

async function updateMatrixDone(event, token){
    const status = event.target.checked ? "C" : "A";
    const matrix_idx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/matrix",
        headers: {"x-access-token": token},
        data: {
            matrix_idx: matrix_idx,
            status: status,
        },
    };

    try{
        const res = await axios(config);
        if(res.data.isSuccess !==true){
            alert(res.data.message);
            return false;
        }

        //dom 업데이트
        readMatrix();

    } catch{
        console.error(err);
        return false;
    }
};

async function updateMatrixContents(event, token) {
    const contents = prompt("Put and Enter.");
    const matrix_idx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/matrix",
        headers: {"x-access-token": token},
        data: {
            matrix_idx: matrix_idx,
            contents: contents,
        },
    };

    try{
        const res = await axios(config);
        if(res.data.isSuccess !==true){
            alert(res.data.message);
            return false;
        }

        //dom 업데이트
        readMatrix();

    } catch{
        console.error(err);
        return false;
    }
}

async function deleteMatrix(event, token) {

    const isValidReq = confirm("Do you want to delete? 삭제 후에는 복구가 어렵습니다.");
    if(!isValidReq){
        return false;
    }

    const matrix_idx = event.target.closest(".list-item").id;

    const config = {
        method: "delete",
        url: url + `/matrix/${matrix_idx}`,
        headers: {"x-access-token": token},
    };

    try{
        const res = await axios(config);
        if(res.data.isSuccess !==true){
            alert(res.data.message);
            return false;
        }

        //dom 업데이트
        readMatrix();

    } catch{
        console.error(err);
        return false;
    }
}