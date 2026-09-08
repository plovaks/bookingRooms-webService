import './RoomloadingItem.css'

function RoomLoadingItem(){
    return(
        <div className='room-loading-item'>
            
            <div className="skeleton-top">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
            </div>

            
            <div className="skeleton-middle">
                <div className="skeleton-row">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-line skeleton-text-line"></div>
                </div>
                <div className="skeleton-row">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-line skeleton-text-line"></div>
                </div>
            </div>

           
            <div className="skeleton-line skeleton-availability"></div>

            
            <div className="skeleton-actions">
                <div className='skeleton-btn-details'></div>
                <div className='skeleton-btn-book'></div>
            </div>
        </div>
    )
}

export default RoomLoadingItem;
