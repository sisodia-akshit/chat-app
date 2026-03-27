import { FaCheck, FaCheckDouble } from "react-icons/fa"
import "../../Styles/Cards.css"
function SendMessageCard({ message, seen }) {
    return (
        <p className="sendMessageCard">
            {message} 
        </p>
    )
}

export default SendMessageCard