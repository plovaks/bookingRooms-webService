import './SuccessBooking.css'
import statusImg from "../../assets/status-badge.svg"
import closeImg from "../../assets/close-btn.svg"

function SuccessBooking({bookingInfo}){
    return(
        <div className='booking__toast'>
            <img src={statusImg} alt="successful booking image" />
            <div className="toast-content">
                <h2>Бронирование создано</h2>
                <p></p>
            </div>
            <button ><img src={closeImg} alt="close toast image" /></button>
        </div>
    )
}

export default SuccessBooking;