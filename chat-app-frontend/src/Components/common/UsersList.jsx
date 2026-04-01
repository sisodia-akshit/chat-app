import { FaArrowRight } from "react-icons/fa"
import ChatCard from "../cards/ChatCard"
import ButtonFirstMessage from "./ButtonFirstMessage"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../ui/Loading";

function UsersList({ data, isLoading, chatCard, activeId }) {
    const { me } = useAuth();

    const navigate = useNavigate();
    const imageClickedHandler = (id) => {
        navigate(`/users/${id}`)
    }
    const cardClickedHandler = (id) => {
        navigate(`/users/${id}`)
    }


    if (isLoading) return <Loading />
    return (
        <>
            {data?.length > 0 && data?.map(curr => {
                let receiver;
                receiver = curr?.members?.find(curr => curr._id !== me._id)

                return (
                    <div key={curr._id} className={receiver && activeId === receiver?._id ? "users-card-active" : 'users-card'}  >

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