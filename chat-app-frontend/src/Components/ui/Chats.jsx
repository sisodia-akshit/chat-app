import "../../Styles/Chats.css"

import { useQuery } from '@tanstack/react-query'

import { getPrevChatUsers } from '../../Services/userAPI'

import UsersList from '../common/UsersList'
import NoChat from './NoChat'
import Loading from './Loading'
import { getPrevChats } from "../../Services/chatsApi"


function Chats({ activeId }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["previousChatUsers"],
        // queryFn: getPrevChatUsers,
        queryFn: getPrevChats,
        retry: false,
        keepPreviousData: true
    })
    const users = data?.data ?? []
    // console.log(users)

    if (!isLoading && users.length === 0) return <div className="noUser-state"><NoChat /></div>
    if (isLoading) return <Loading />
    return (
        <div className="chats">
            <h2 className="chats-heading">Chats</h2>

            {/* <div className="chats-buttons-container">
                <div className="chats-buttons">
                    <button type='button' className="chats-go-button chats-go-button-active">General</button>
                    <button type='button' className="chats-go-button">Archive</button>
                </div>
            </div> */}

            <div className="chat-Cards">
                <UsersList data={users} chatCard={true} activeId={activeId} />
            </div>
        </div>
    )
}

export default Chats