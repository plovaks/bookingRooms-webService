import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import "./FilterBar.css";

registerLocale("ru", ru);

function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} мин`;
    let hourLabel = "ч";
    if (minutes === 0) {
        if (hours === 1) hourLabel = "час";
        else if (hours >= 2 && hours <= 4) hourLabel = "часа";
        else hourLabel = "часов";
        return `${hours} ${hourLabel}`;
    }
    return `${hours} ч ${minutes} мин`;
}

function FilterBar({selectedOffice}) {
    const [startDate, setStartDate] = useState(null);
    const [timeValue, setTimeValue] = useState("");
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); 

    const [durationOpen, setDurationOpen] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState("Выберите");
   
    const [capacityOpen, setCapacityOpen] = useState(false);
    const [selectedCapacity, setSelectedCapacity] = useState("Не указано");
    
   
    const capacities = ["1 чел.", "2 чел.", "4 чел.", "6 чел.", "8 чел.", "10 чел.", "12 чел."];

    const getDynamicDurations = () => {
        if (!timeValue || timeValue.length < 5) {
            const defaultList = [];
            for (let mins = 15; mins <= 180; mins += 15) {
                defaultList.push({ label: formatMinutes(mins), mins: mins });
            }
            return defaultList;
        }
        const [hours, minutes] = timeValue.split(':').map(Number);
        const currentMins = hours * 60 + minutes;
        const closingMins = 20 * 60;
        const maxAvailableMins = closingMins - currentMins;

        const generatedList = [];
        for (let mins = 15; mins <= maxAvailableMins; mins += 15) {
            generatedList.push({ label: formatMinutes(mins), mins: mins });
        }
        return generatedList;
    };

    const availableDurations = getDynamicDurations();

    const handleTimeChange = (e) => {
        let input = e.target.value.replace(/\D/g, "");
        if (input.length > 4) { input = input.substring(0, 4); }
        if (input.length > 2) { input = input.substring(0, 2) + ":" + input.substring(2); }
        setTimeValue(input);
    }

    const handleTimeBlur = () => {
        if (!timeValue) return;
        let [hours, minutes] = timeValue.split(':').map(Number);
        
        if (!isNaN(minutes)) {
            minutes = Math.round(minutes / 15) * 15;
            if (minutes === 60) { hours += 1; minutes = 0; }
        } else { minutes = 0; }

        if (hours < 9) { hours = 9; minutes = 0; }
        else if (hours > 20 || (hours === 20 && minutes > 0)) { hours = 20; minutes = 0; }
        
        const validHours = hours < 10 ? `0${hours}` : hours;
        const validMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedTime = `${validHours}:${validMinutes}`;
        
        setTimeValue(formattedTime);

        const currentMins = hours * 60 + minutes;
        const minsLeft = (20 * 60) - currentMins;
        const freshOptions = [];
        for (let mins = 15; mins <= minsLeft; mins += 15) {
            freshOptions.push({ label: formatMinutes(mins), mins: mins });
        }
        const isStillValid = freshOptions.some(item => item.label === selectedDuration);
        if (!isStillValid && freshOptions.length > 0) {
            setSelectedDuration(freshOptions[freshOptions.length - 1].label);
        }
    }

    return (
        
        <div className={`filter-bar ${!selectedOffice ? "filter-bar--disabled" : ""}`}>
            
            <div className="filter-item">
                <label htmlFor="calendar">ДАТА</label>
                <div className="datepicker-wrapper">
                    <DatePicker
                        id="calendar"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="d MMMM, eeeeee" 
                        locale="ru"
                        minDate={new Date()}
                        maxDate={maxDate}
                        className="calendar-input"
                        showPopperArrow={false}
                        placeholderText="Выберите дату"
                        disabled={!selectedOffice}
                    />
                </div>
            </div>

            
            <div className="filter-item">
                <label htmlFor="time-picker">ВРЕМЯ НАЧАЛА</label>
                <div className="time-input-wrapper">
                    <input 
                        type="text" 
                        id="time-picker" 
                        name="time" 
                        onChange={handleTimeChange}
                        placeholder="--:--"
                        value={timeValue}
                        onBlur={handleTimeBlur}
                        className="time-input"
                        disabled={!selectedOffice}
                    />
                </div>
            </div>

            
            <div className="filter-item">
                <label>ДЛИТЕЛЬНОСТЬ</label>
                <div 
                    className={`select-custom ${durationOpen ? "open" : ""}`} 
                    onClick={() => {
                        setDurationOpen(!durationOpen);
                        setCapacityOpen(false); 
                    }}
                >
                    <span>{selectedDuration}</span>
                    <div className="select-arrow"></div>
                </div>

                {durationOpen && (
                    <div className="select-dropdown">
                        {availableDurations.map((item) => (
                            <div
                                key={item.label}
                                className={`dropdown-item ${selectedDuration === item.label ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedDuration(item.label);
                                    setDurationOpen(false);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            
            <div className="filter-item">
                <label>ВМЕСТИМОСТЬ</label>
                <div 
                    className={`select-custom capacity-select ${capacityOpen ? "open" : ""}`} 
                    onClick={() => {
                        setCapacityOpen(!capacityOpen);
                        setDurationOpen(false); 
                    }}
                >
                    <span>{selectedCapacity}</span>
                    <div className="select-arrow"></div>
                </div>

                {capacityOpen && (
                    <div className="select-dropdown">
                        {capacities.map((item) => (
                            <div
                                key={item}
                                className={`dropdown-item ${selectedCapacity === item ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedCapacity(item);
                                    setCapacityOpen(false);
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
