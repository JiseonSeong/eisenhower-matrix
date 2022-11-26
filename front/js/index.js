//헤더를 정의 할 수 있는 함수
setHeader();

//로그인하면 회원정보란에 닉네임출력
async function setHeader() {
    //1. 로컬스토리지에 토큰 존재여부 검사
    const token = localStorage.getItem("x-access-token");

    //2. 토큰이 없다면 signed에 hidden클래스 붙이기
    if(!token) {
        const signed = document.querySelector(".signed");
        signed.classList.add("hidden");
        return;
    }

    //4. 토큰검증
    const config = {
        method: "get",
        url: url + "/jwt",
        headers: {
            "x-access-token": token,
        },
    };
    const res = await axios(config);

    if(res.data.isSuccess !== true) {
        console.log("ERROR : Wrong token.");
        return;
    }

    const nickname = res.data.result.nickname;
    const spanNickname = document.querySelector("span.nickname");
    spanNickname.innerText = nickname;

    //3. 토큰이 있다면 unsigned에 hidden클래스 붙이기
    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");
}

//로그아웃기능 -> 토큰삭제
const buttonSignout = document.getElementById("sign-out");
buttonSignout.addEventListener("click",signout);

function signout() {
    localStorage.removeItem("x-access-token");
    location.reload();
}
