
import { FaCheck } from 'react-icons/fa6'

import "../../Styles/Cards.css"
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';
import socket from '../../Lib/socket';

function ChatCard({ data }) {
    const { me } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const receiver = data?.members.find(curr => curr._id !== me._id)

    const imageClickedHandler = () => {
        navigate(`/users/${receiver._id}`)
    }
    const cardClickedHandler = () => {
        queryClient.invalidateQueries(["user"])
        navigate(`/${receiver._id}`)

    }

    return (
        <div className="chatCard">
            <button className="chatCard-image" onClick={imageClickedHandler}>
                <img src={receiver?.photo} alt={receiver.name} className="chat-photo" />
            </button>
            <button className="chatCard-content" onClick={cardClickedHandler}>
                <h4 className='chatCard-content-top'>{receiver?.name}</h4>
                <p className="chatCard-content-main">{data?.lastMessage?.content}</p>
            </button>
            {/* <div className="chatCard-detail">
                <p className="chatCard-detail-time">10:23</p>
                <p className="chatCard-detail-seen"><FaCheck color='#ccc' /></p>
            </div> */}

        </div>
    )
}

export default ChatCard