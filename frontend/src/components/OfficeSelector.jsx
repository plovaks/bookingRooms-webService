import { useState, useEffect } from "react"
import "./OfficeSelector.css"
import Arrow from "../assets/arrowDown.svg"

function OfficeSelector({selectedOffice, onOfficeChange, offices}){
    const [isOpen, setIsOpen] = useState(false); // состояние для списка офисов
    
    function handleOfficeClick(){
        setIsOpen(!isOpen);
    }

    function handleSelectedOffice(e, office){
        e.stopPropagation();
        onOfficeChange(office);
        setIsOpen(false);
    }

    function formatTime(timezone) {
    if (!timezone) return "";

    try {
        const now = new Date();

        
        const formatter = new Intl.DateTimeFormat("ru-RU", {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        
        const customTimezones = {
            "Europe/Moscow": "MSK",
        };

        let tzName = customTimezones[timezone];

        
        if (!tzName) {
            const tzFormatter = new Intl.DateTimeFormat('ru-RU', {
                timeZone: timezone,
                timeZoneName: 'shortGeneric'
            });
            const parts = tzFormatter.formatToParts(now);
            tzName = parts.find(p => p.type === "timeZoneName")?.value || "";
        }

        return `${formatter.format(now)} ${tzName}`;
        } catch (error) {
            console.log("Ошибка форматирования времени:", error);
            return "";
        }
    }

    return(
        <>
            <div className="office-selector">
                <div className="office-info">
                    <div className="selector-trigger" onClick={handleOfficeClick}>
                        <span> {selectedOffice ? selectedOffice.name : "Выберите офис"}</span>
                        <span
                            onClick={handleOfficeClick}
                            style={{cursor:'pointer'}}
                        >
                            <img src={Arrow} alt="dropdown arrow" className={`arrow-icon ${isOpen ? 'open' : ''}`}/>
                        </span>
                    </div>

                    <div className="office-meta">
                        <span className="office-street">{selectedOffice ? selectedOffice.address : "Адрес не выбран"}</span>
                        <span className="circle-divider"></span>
                        <span className="current-time">Местное время: {selectedOffice ? formatTime(selectedOffice?.timezone) : "--"}</span>
                    </div>

                    {isOpen && (
                        <div className="offices-dropdown">
                            <ul>
                                {offices.map((office) => (
                                    <li
                                        key={office?.id}
                                        onClick={(e) =>handleSelectedOffice(e, office)}
                                        className={selectedOffice?.id === office.id ? 'active' : ''}
                                    >
                                        {office?.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            
        </>
    )
}

export default OfficeSelector;