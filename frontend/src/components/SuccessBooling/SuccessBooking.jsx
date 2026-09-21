import './SuccessBooking.css'
import toast from 'react-hot-toast'
import statusImg from "../../assets/status-badge.svg"
import closeImg from "../../assets/close-btn.svg"


function SuccessBooking({t, bookingInfo}){
    return(
        <div className={`booking__toast ${t.visible ? 'booking__toast--visible' : 'booking__toast--hidden'}`}>
            <img src={statusImg} alt="successful booking image" className='successful-booking__Img' />
            <div className="toast-content">
                <h2>Бронирование создано</h2>
                <p>{bookingInfo}</p>
            </div>
            <button 
                type='button'
                className='toast-close'
                onClick={() => toast.dismiss(t.id)}
                aria-label='Закрыть'
            >
                <img src={closeImg} alt="close toast image" className='close-image' />
            </button>
        </div>
    )
}

export default SuccessBooking;