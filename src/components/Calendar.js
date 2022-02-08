import React, { useState, useEffect } from "react";
import "../styles/Calendar.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import axios from "axios";
import API_KEYS from "../config/apikey.json";

function Calendar() {
    const d = new Date();

    const arDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const arLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const [arDate, setArDate] = useState([]);
    const [selected, setSelected] = useState({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
    });

    useEffect(() => {
        makeCal(selected);
        getMonthlySchedules();
    }, [selected.month]);

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
            date: -1,
        };
        setSelected(newMonth);
    };

    const nextMonth = () => {
        const newMonth = {
            year: selected.month === 12 ? selected.year + 1 : selected.year,
            month: selected.month === 12 ? 1 : selected.month + 1,
            date: -1,
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
                userkey: 10,
            },
        }).then((res) => {
            console.log(res.data);
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
                userkey: 10,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const addSchedule = async () => {
        axios({
            // fetch
            method: "POST", // REST api(get, post, put, delete) vs Graph QL
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar,
                StartDateTime: "2022-02-10T21:00", // YYYY-MM-DDThh:mm
                EndDateTime: "2022-02-10T23:00",
                UserKey: 10,
                Title: "스터디 하는날~~",
                Memo: "메모메모",
                AllDay: false,
            },
        }).then((res) => {
            console.log(res.data);
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

    return (
        <div className="Calendar">
            <header>
                <BiChevronLeft size={60} color="white" onClick={prevMonth} />
                <div>
                    <p className="year">{selected.year}</p>
                    <p className="month">{selected.month}</p>
                </div>
                <BiChevronRight size={60} color="white" onClick={nextMonth} />
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
                    {arDate.map((value, index) => (
                        <li key={index} className="date">
                            <span
                                className={
                                    value == selected.date ? "today" : ""
                                }
                            >
                                {value}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Calendar;
