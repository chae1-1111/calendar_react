import React, { useState, useEffect } from "react";
import "../styles/Calendar.scss";

function Calendar() {
    const d = new Date();

    const arDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const arLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const [firstDay, setFirstDay] = useState(
        d.getDay() - (d.getDate() % 7) + 1
    );
    const [arDate, setArDate] = useState([]);

    useEffect(() => {
        makeCal();
    }, []);

    const makeCal = () => {
        const newArDate = [];
        for (let i = 0; i < firstDay; i++) {
            newArDate.push("");
        }
        for (let i = 0; i < arLastDate[d.getMonth()]; i++) {
            newArDate.push(i + 1 + "");
        }
        setArDate(newArDate);
    };

    return (
        <div className="Calendar">
            <header>
                {/* 시멘틱태그 */}
                <p>My Calendar</p>
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
                                    index === d.getDate() - 1 + firstDay
                                        ? "today"
                                        : ""
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
