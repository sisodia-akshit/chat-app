import { FaSearch } from "react-icons/fa"
import "../../Styles/Ui.css"
import { useNavigate } from "react-router-dom"

function NoChat() {
    const navigate = useNavigate();
    const searchClickedHandler = () => {
        navigate("/users")
    }
    return (
        <div className="noChat">
            <div className="noChat-button">
                <button type="button" className="noChat-search-button" onClick={searchClickedHandler} >
                    <FaSearch className="no-chat-searchIcon" />
                </button>
                <p className="noChat-button-name">Search User</p>
            </div>
        </div>
    )
}

export default NoChat