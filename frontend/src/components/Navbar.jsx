import logoImg from "../assets/logo-badge.svg"
import { NavLink } from "react-router";
import "./Navbar.css"
function Navbar(){


    return(
        <nav className="navbar">
            <div className="navbar__logo">
                <img src={logoImg} alt="logo-badge" className="logo-badge"/>
                <span className="logo-text">BookRoom</span>
            </div>
            <div className="navbar__nav-links">
                <NavLink to="/" className="nav-link">Переговорные</NavLink>
                <NavLink to="/bookings" className="nav-link">Мои бронирования</NavLink>
            </div>
            <div className="navbar__user-profile">
                <span className="user-info">иванов И. И.</span>
                <div className="avatar-wrapper">
                    <div className="avatar-circle"></div>
                    <span className="user-initials">КК</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;