import { FaArrowRight } from "react-icons/fa"
import ChatCard from "../cards/ChatCard"
import UserCard from "../cards/UserCard"
import ButtonFirstMessage from "./ButtonFirstMessage"
import { useNavigate } from "react-router-dom";

function UsersList({ data, chatCard, activeId }) {
    const navigate = useNavigate();
    const imageClickedHandler = (id) => {
        navigate(`/users/${id}`)
    }
    const cardClickedHandler = (id) => {
        navigate(`/users/${id}`)
    }

    return (
        <>
            {data?.length > 0 && data?.map(curr => {

                return (
                    <div key={curr._id} className={activeId === curr._id ? "users-card-active" : 'users-card'}  >

                        {!chatCard && <>
                            <div className="chatCard">
                                <button className="chatCard-image" onClick={() => imageClickedHandler(curr._id)}>
                                    <img src={curr?.photo} alt={curr?.name} className="chat-photo" />
                                </button>
                                <button className="chatCard-content" onClick={() => cardClickedHandler(curr._id)}>
                                    <h4 className='chatCard-content-top'>{curr?.name}</h4>
                                    <p className="chatCard-content-main">{curr?.email}</p>
                                </button>
                                <div className="userCard-end">
                                    <ButtonFirstMessage id={curr._id} user={curr}>
                                        <FaArrowRight color="#fff" />
                                    </ButtonFirstMessage>
                                </div>

                            </div>
                        </>
                        }
                        {chatCard && <ChatCard data={curr} />}
                    </div>
                )
            })}

            {data?.length === 0 && <p className="usersList-empty">No User Found!</p>}
        </>
    )
}

export default UsersList