import noAvailable from "../../assets/noAvailable.svg"
function RoomsEmpty({setFilters}){

    const handleReset = () => {
        setFilters((prev) => ({
            ...prev,
            duration: 30,                           
            capacity: null
        }))
    }

    return(
        <div className="main-content">
            <img src={noAvailable} alt="no available rooms image" />
            <div className="text-group">
                <h2>Нет доступных переговорных</h2>
                <p>Попробуйте изменить параметры фильтрации или выбрать другой офис</p>
            </div>
            <button onClick={handleReset}>Сбросить фильтры</button>
        </div>
    )
}

export default RoomsEmpty;