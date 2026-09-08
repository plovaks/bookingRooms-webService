import { useState, useEffect } from "react"
import "./OfficeSelector.css"
import Arrow from "../assets/arrowDown.svg"

function OfficeSelector(){
    const [selectedOffice, setselectedOffice] = useState(null);
    const [offices, setOffices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

  
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(()=> {
        const loadOffices = async() => {
            try{
                
                const res = await fetch(`${apiUrl}/api/v1/offices`);
                
                if (!res.ok){
                    throw new Error ('Ошибка HTTP: ' + res.status);
                }

                const data = await res.json();
                setOffices(data.items);
                console.log('data from server: ', data);

                if(data.items.length > 0){
                    setselectedOffice(data.items[0])
                }
            }
            catch (error){
                console.log('произошла ошибка: ', error);
            }

        }
        loadOffices();

    },[]);
    
    function handleOfficeClick(){
        setIsOpen(!isOpen);
    }

    function handleSelectedOffice(e, office){
        e.stopPropagation();
        setselectedOffice(office);
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
                    <div className="selector-trigger">
                        <span> {selectedOffice?.name}</span>
                        <span
                            onClick={handleOfficeClick}
                            style={{cursor:'pointer'}}
                        >
                            <img src={Arrow} alt="dropdown arrow" className={`arrow-icon ${isOpen ? 'open' : ''}`}/>
                        </span>
                    </div>

                    <div className="office-meta">
                        <span className="office-street">{selectedOffice?.address}</span>
                        <span className="circle-divider"></span>
                        <span className="current-time">Местное время: {formatTime(selectedOffice?.timezone)}</span>
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