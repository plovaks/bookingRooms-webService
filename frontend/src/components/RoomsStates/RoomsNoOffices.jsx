import noOffices from "../../assets/noOffices.svg"
import './RoomsNoOffices.css'
function RoomsNoOffices(){
    return(
        <div className="main-content">
            <img src={noOffices} alt="image of empty office" className="noOffice-img" />
            <div className="text-group">
                <h2>Выберите офис</h2>
                <p>Для просмотра доступных переговорных сначала выберите офис из списка выше</p>
            </div>
        </div>
    )
}

export default RoomsNoOffices;