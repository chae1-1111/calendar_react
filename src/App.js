import "./App.css";
import Calendar from "./components/Calendar";
import Login from "./components/Login"; // 로그인 -> 세션
import React, { useState } from "react";

function App() {
    const [user, setUser] = useState({
        UserKey: window.sessionStorage.getItem("UserKey"),
        name: window.sessionStorage.getItem("name"),
    });

    return (
        <div className="App">
            {user.UserKey ? (
                <Calendar user={user} setUser={setUser} />
            ) : (
                <Login setUser={setUser} />
            )}
        </div>
    );
}

export default App;
