import errorImg from "../../assets/roomsErrorAlert.svg"
function RoomsError(){
    return(
        <div className="main-content">
            <img src={errorImg} alt="error image" />
            <div className="text-group">
                <h2>Не удалось загрузить данные</h2>
                <p>Произошла ошибка при загрузке списка переговорных</p>
            </div>
            <button>Попробовать снова</button>
        </div>
    )
}

export default RoomsError;