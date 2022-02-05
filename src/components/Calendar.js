import React, { useState, useEffect } from "react";
import "../styles/Calendar.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import API from "../config/apiSettings.json";

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
        getDailySchedules();
    }, []);

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
        makeCal(newMonth);
    };

    const nextMonth = () => {
        const newMonth = {
            year: selected.month === 12 ? selected.year + 1 : selected.year,
            month: selected.month === 12 ? 1 : selected.month + 1,
            date: -1,
        };
        setSelected(newMonth);
        makeCal(newMonth);
    };

    const getMonthlySchedules = async () => {
        const result = await (
            await fetch(API.url + "/calendar?year=2022&month=2")
        ).json();
        console.log(result);
    };

    const getDailySchedules = async () => {
        const result = await (
            await fetch(API.url + "/calendar?year=2022&month=2&date=5")
        ).json();
        console.log(result);
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
