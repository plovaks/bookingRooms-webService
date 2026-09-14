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

function FilterBar({selectedOffice, filters, setFilters}) {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); 

    const [durationOpen, setDurationOpen] = useState(false);   
    const [capacityOpen, setCapacityOpen] = useState(false);
    
   
    const capacities = ["1 чел.", "2 чел.", "4 чел.", "6 чел.", "8 чел.", "10 чел.", "12 чел."];

    const getDynamicDurations = () => {
        if (!filters.time || filters.time.length < 5) {
            const defaultList = [];
            for (let mins = 15; mins <= 180; mins += 15) {
                defaultList.push({ label: formatMinutes(mins), mins: mins });
            }
            return defaultList;
        }
        const [hours, minutes] = filters.time.split(':').map(Number);
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
        setFilters(prev => ({...prev, time:input}))
    }

    const handleTimeBlur = () => {
        if (!filters.time) return;
        let [hours, minutes] = filters.time.split(':').map(Number);
        
        if (!isNaN(minutes)) {
            minutes = Math.round(minutes / 15) * 15;
            if (minutes === 60) { hours += 1; minutes = 0; }
        } else { minutes = 0; }

        if (hours < 9) { hours = 9; minutes = 0; }
        else if (hours > 20 || (hours === 20 && minutes > 0)) { hours = 20; minutes = 0; }
        
        const validHours = hours < 10 ? `0${hours}` : hours;
        const validMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedTime = `${validHours}:${validMinutes}`;
        

        const currentMins = hours * 60 + minutes;
        const minsLeft = (20 * 60) - currentMins;
        let updatedDuration = filters.duration;
        if (filters.duration && filters.duration > minsLeft) {
            updatedDuration = minsLeft > 0 ? minsLeft : null;
        }

        
        setFilters(prev => ({
            ...prev,
            time:formattedTime,
            duration: updatedDuration
        }))
    }

    return (
        
        <div className={`filter-bar ${!selectedOffice ? "filter-bar--disabled" : ""}`}>
            
            <div className="filter-item">
                <label htmlFor="calendar">ДАТА</label>
                <div className="datepicker-wrapper">
                    <DatePicker
                        id="calendar"
                        selected={filters.date}
                        onChange={(date) => setFilters(prev => ({ ...prev, date }))}
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
                        value={filters.time}
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
                    <span>{filters.duration ? formatMinutes(filters.duration) : "Выберите"}</span>
                    <div className="select-arrow"></div>
                </div>

                {durationOpen && (
                    <div className="select-dropdown">
                        {availableDurations.map((item) => (
                            <div
                                key={item.label}
                                className={`dropdown-item ${filters.duration === item.mins ? "selected" : ""}`}
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, duration: item.mins })); 
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
                    <span>{filters.capacity ? `${filters.capacity} чел.` : "Не указано"}</span>
                    <div className="select-arrow"></div>
                </div>

                {capacityOpen && (
                    <div className="select-dropdown">
                        {capacities.map((item) => {
                            const numericCapacity = parseInt(item); 
                            return (
                                <div
                                    key={item}
                                    className={`dropdown-item ${filters.capacity === numericCapacity ? "selected" : ""}`}
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, capacity: numericCapacity }));
                                        setCapacityOpen(false);
                                    }}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
