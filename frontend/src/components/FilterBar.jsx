import "./FilterBar.css"

function FilterBar(){
    
    

    return(
        <div className="filter-bar">
            <div className="filter-item">
                <label for="calendar">ДАТА</label>
                <input type="date" id="calendar" name="calendar"/>
            </div>

            <div className="filter-item">
                <label for="time-picker">ВРЕМЯ НАЧАЛА</label>
                <input type="time" id="time-picker" name="time"/>
            </div>

            <div className="filter-item">
                <label for="duration">ДЛИТЕЛЬНОСТЬ</label>
                <select name="duration" id="duration"></select>
            </div>

            <div className="filter-item">
                <label for="capacity">ВМЕСТИМОСТЬ</label>
                <p></p>
            </div>
        </div>
    )
}

export default FilterBar;