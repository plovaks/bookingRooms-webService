import noAvailable from "../../assets/noAvailable.svg"
function RoomsEmpty(){
    return(
        <div className="main-content">
            <img src={noAvailable} alt="no available rooms image" />
            <div className="text-group">
                <h2>Нет доступных переговорных</h2>
                <p>Попробуйте изменить параметры фильтрации или выбрать другой офис</p>
            </div>
            <button>Сбросить фильтры</button>
        </div>
    )
}

export default RoomsEmpty;