import "../../Styles/Cards.css"
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';
import { decryptMessage } from '../../Hooks/useEncryptMessage';
import { FaCheck, FaCheckDouble } from "react-icons/fa6";

function ChatCard({ data }) {
    const { me } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const receiver = data?.members.find(curr => curr._id !== me._id)
    let content;

    if (data?.lastMessage) {
        content = decryptMessage(data?.lastMessage?.content, data?.lastMessage?.nonce, receiver?.publicKey, localStorage.getItem("privateKey"))
    }

    const imageClickedHandler = () => {
        navigate(`/users/${receiver._id}`)
    }
    const cardClickedHandler = () => {
        queryClient.invalidateQueries(["user"])
        navigate(`/${receiver._id}`)

    }
    const date = new Date(data.updatedAt)
    const time = `${date.getHours()}:${date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString()}`

    return (
        <div className="chatCard">
            <button className="chatCard-image" onClick={imageClickedHandler}>
                <img src={receiver?.photo} alt={receiver.name} className="chat-photo" />
            </button>
            <button className="chatCard-content" onClick={cardClickedHandler}>
                <h4 className='chatCard-content-top'>{receiver?.name}</h4>
                {content && <p className="chatCard-content-main">{content}</p>}
            </button>
            <div className="chatCard-detail">
                <p className="chatCard-detail-time">{time}</p>
                {data?.lastMessage?.sender != me._id && data.unreads > 0 && <p className="chatCard-detail-unreads">{data.unreads}</p>}
                {data?.lastMessage?.sender == me._id && data?.seen === false && <p className="chatCard-detail-seen"><FaCheck color="#ccc"/></p>}
                {data?.lastMessage?.sender == me._id && data?.seen === true && <p className="chatCard-detail-seen"><FaCheckDouble color="#00d0ff" /></p>}
            </div>

        </div>
    )
}

export default ChatCard