import React, { useState, useEffect, version } from "react";
import "../styles/Calendar.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IoLogOutOutline, IoAddCircleOutline, IoClose } from "react-icons/io5";
import axios from "axios";
import API_KEYS from "../config/apikey.json";

function Calendar(props) {
    const d = new Date();

    const arDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const arLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const [arDate, setArDate] = useState([]);
    const [selected, setSelected] = useState({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
    });
    const [viewAdd, setViewAdd] = useState(null);
    const [arSchedule, setArSchedule] = useState([]);

    useEffect(() => {
        makeCal(selected);
        getMonthlySchedules();
    }, [selected.month]);

    const select = (date) => {
        const newSelected = {
            year: selected.year,
            month: selected.month,
            date: date,
        };
        setSelected(newSelected);
    };

    const makeCal = (data) => {
        const firstDay = new Date(`${data.year}-${data.month}-01`).getDay();
        const newArDate = [];
        for (let i = 0; i < firstDay; i++) {
            newArDate.push("");
        }
        for (let i = 0; i < arLastDate[data.month - 1]; i++) {
            newArDate.push(i + 1 + "");
        }
        setArDate(newArDate);
    };

    const prevMonth = () => {
        const newMonth = {
            year: selected.month === 1 ? selected.year - 1 : selected.year,
            month: selected.month === 1 ? 12 : selected.month - 1,
            date: 1,
        };
        setSelected(newMonth);
    };

    const nextMonth = () => {
        const newMonth = {
            year: selected.month === 12 ? selected.year + 1 : selected.year,
            month: selected.month === 12 ? 1 : selected.month + 1,
            date: 1,
        };
        setSelected(newMonth);
    };

    const getMonthlySchedules = async () => {
        axios({
            // fetch
            method: "GET",
            url: "/calendar",
            params: {
                apikey: API_KEYS.calendar,
                year: selected.year,
                month: selected.month,
                userkey: props.user.UserKey,
            },
        }).then((res) => {
            console.log(res.data);
            setArSchedule(res.data.result);
        });
    };

    const getDailySchedules = async () => {
        axios({
            // fetch
            method: "GET",
            url: "/calendar",
            params: {
                apikey: API_KEYS.calendar,
                year: selected.year,
                month: selected.month,
                date: selected.date,
                userkey: props.user.UserKey,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const addSchedule = async () => {
        let date =
            selected.year +
            "-" +
            String(selected.month).padStart(2, "0") +
            "-" +
            String(selected.date).padStart(2, "0");
        let startTime = document.getElementById("startTime");
        let endTime = document.getElementById("endTime");
        let title = document.getElementById("title");
        let memo = document.getElementById("memo");
        let allday = document.getElementById("allday"); //true | false

        if (!startTime.value) {
            alert("시작 시간을 입력해주세욧!");
            return;
        } else if (!endTime.value) {
            alert("종료 시간을 입력해주세욧!");
            return;
        } else if (!title.value) {
            alert("일정 제목을 입력해주세욧!");
            return;
        }

        axios({
            // fetch
            method: "POST", // REST api(get, post, put, delete) vs Graph QL
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar, //mandatory
                StartDateTime: date + "T" + startTime.value, //mandatory
                EndDateTime: date + "T" + endTime.value, //mandatory
                UserKey: props.user.UserKey, //mandatory
                Title: title.value, //mandatory
                Memo: memo.value, //optional
                AllDay: allday.checked, //optional
            },
        }).then((res) => {
            getMonthlySchedules();
            setViewAdd(null);
            startTime.value = "";
            endTime.value = "";
            startTime.readOnly = false;
            endTime.readOnly = false;
            title.value = "";
            memo.value = "";
            allday.checked = false;
        });
    };

    const editSchedule = async () => {
        axios({
            // fetch
            method: "PUT",
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar,
                id: "62026febb7f1163179d98c4c",
                UserKey: 10,
                StartDateTime: "2022-02-10T21:30", // YYYY-MM-DDThh:mm
                EndDateTime: "2022-02-10T23:30",
                Title: "스터디 하는날~~",
                Memo: "메모하기 시룸",
                AllDay: false,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const removeSchedule = async () => {
        axios({
            // fetch
            method: "DELETE",
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar,
                id: "62026febb7f1163179d98c4c",
                UserKey: 10,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const logout = () => {
        props.setUser({
            UserKey: null,
            name: null,
        });
        window.sessionStorage.removeItem("UserKey");
        window.sessionStorage.removeItem("name");
    };

    const allDay = (e) => {
        const startTime = document.getElementById("startTime");
        const endTime = document.getElementById("endTime");
        if (e.target.checked) {
            startTime.value = "00:00";
            endTime.value = "23:59";
            startTime.readOnly = true;
            endTime.readOnly = true;
        } else {
            startTime.readOnly = false;
            endTime.readOnly = false;
        }
    };

    return (
        <div className="Calendar">
            <header>
                <BiChevronLeft size={60} color="white" onClick={prevMonth} />
                <div>
                    <p className="year">{selected.year}</p>
                    <p className="month">{selected.month}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IoAddCircleOutline
                        size={40}
                        color="white"
                        onClick={() => setViewAdd("Add")}
                    />
                    <IoLogOutOutline size={40} color="white" onClick={logout} />
                    <BiChevronRight
                        size={60}
                        color="white"
                        onClick={nextMonth}
                    />
                </div>
            </header>
            <div className="content">
                <ul className="arDay">
                    {arDay.map((value, index) => (
                        <li key={index} className="day">
                            {value}
                        </li>
                    ))}
                </ul>
                <ul className="arDate">
                    {arDate.map((date, index) => (
                        <li
                            key={index}
                            className="date"
                            onClick={() => select(date)}
                        >
                            <span
                                className={date == selected.date ? "today" : ""}
                            >
                                {date}
                            </span>
                            <ul className="schedules">
                                {
                                    // arSchedule[0].StartDateTime <- 2022-02-16T21:00  8,9
                                    arSchedule.map((schedule, scheIndex) =>
                                        parseInt(
                                            schedule.StartDateTime.substr(8, 2)
                                        ) == date ? (
                                            <li
                                                key={scheIndex}
                                                onClick={() =>
                                                    setViewAdd("Detail")
                                                }
                                            >
                                                {schedule.Title}
                                            </li>
                                        ) : null
                                    )
                                }
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className="addSchedule"
                style={viewAdd ? {} : { display: "none" }}
            >
                <div className="addScheduleForm">
                    <IoClose
                        className="btn-close"
                        size={40}
                        onClick={() => setViewAdd(null)}
                    />
                    <h2>
                        일정{" "}
                        {viewAdd === "Add"
                            ? "추가"
                            : viewAdd === "Edit"
                            ? "수정"
                            : ""}
                    </h2>
                    {viewAdd === "Add" ? (
                        <div>
                            <p>
                                {selected.year}년 {selected.month}월{" "}
                                {selected.date}일
                            </p>
                            <input type="time" id="startTime" />
                            <input type="time" id="endTime" />
                            <label>
                                <input
                                    id="allday"
                                    type="checkbox"
                                    onChange={allDay}
                                />
                                하루 종일
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="일정 제목"
                            />
                            <input
                                id="memo"
                                type="text"
                                placeholder="일정 내용"
                            />
                            <button onClick={addSchedule}>일정 추가</button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
