import './NotFound.css'
import home from "../../assets/home.svg"
import { Link } from 'react-router';
function NotFound(){
    return (
    <div className="not-found">
        <div className="not-found-info">
            <h1>404</h1>
            <h3>Страница не найдена</h3>
            <p>Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.</p>
        </div>
        <Link
            to={"/rooms"} 
            className="button-green"
        >   
            <img src={home} alt="home icon" />
            Вернуться к переговорным
        </Link>
    </div>)

    
}

export default NotFound;