import logoImg from "../assets/logo-badge.svg"
import { NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";
import "./Navbar.css"

const OFFICE_STORAGE_KEY = 'selectedOfficeId';

function Navbar(){
    const apiUrl = import.meta.env.VITE_API_URL;
    const [userData, setUserData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleUserData = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/v1/me`);

                if(!res.ok){
                    throw new Error('ошибка обращения к url: ', res.status);
                }

                const data = await res.json();
                setUserData(data);
                // console.log(data);

            } catch (error) {
                console.error('ошибка получения данных пользователя: ', error)
            }
        }

        handleUserData();
    }, [apiUrl])

    const getRoomsLink = () => {
        const savedOfficeId = localStorage.getItem(OFFICE_STORAGE_KEY);
        return savedOfficeId ? `/rooms?officeId=${savedOfficeId}` : "/rooms";

    }

    return(
        <nav className="navbar">
            <div className="navbar__logo">
                <img src={logoImg} alt="logo-badge" className="logo-badge"/>
                <span className="logo-text">BookRoom</span>
            </div>
            <div className="navbar__nav-links">
                <NavLink to={getRoomsLink()} className="nav-link">Переговорные</NavLink>
                <NavLink to="/bookings" className="nav-link">Мои бронирования</NavLink>
            </div>
            {userData && (
                <div className="navbar__user-profile">
                    <span className="user-info">{userData.displayName}</span>
                    <div className="avatar-wrapper">
                        <div className="avatar-circle"></div>
                        <span className="user-initials">{userData.initials}</span>
                    </div>
                </div>
            )}
            
        </nav>
    )
}

export default Navbar;