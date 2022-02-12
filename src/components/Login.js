import axios from "axios";
import API_KEYS from "../config/apikey.json";

const Login = (props) => {
    const login = async () => {
        axios({
            // fetch
            method: "GET",
            url: "/member",
            params: {
                apikey: API_KEYS.calendar,
                userid: document.getElementById("userid").value,
                userpw: document.getElementById("userpw").value,
            },
        }).then((res) => {
            if (res.data.code === 200) {
                props.setUser({
                    UserKey: res.data.userkey,
                    name: res.data.name,
                });
                window.sessionStorage.setItem("UserKey", res.data.userkey);
                window.sessionStorage.setItem("name", res.data.name);
            } else {
                alert("로그인 실패!");
                document.getElementById("userid").focus();
            }
        });
    };

    const pressEnter = (e) => {
        if (e.key === "Enter") login();
    };

    return (
        <div className="Login">
            <h1>로그인</h1>
            <input
                type="text"
                id="userid"
                name="userid"
                onKeyDown={pressEnter}
            />
            <input
                type="password"
                id="userpw"
                name="userpw"
                onKeyDown={pressEnter}
            />
            <button onClick={login}>로그인</button>
        </div>
    );
};

export default Login;
