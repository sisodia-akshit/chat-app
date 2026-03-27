import "../../Styles/Chats.css"

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getPrevChatUsers } from '../../Services/userAPI'

import UsersList from '../common/UsersList'
import NoChat from './NoChat'
import Loading from './Loading'
import { getPrevChats } from "../../Services/chatsApi"
import { useEffect } from "react"
import socket from "../../Lib/socket"


function Chats({ activeId }) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["previousChatUsers"],
        queryFn: getPrevChats,
    })
    const users = data?.data ?? []

    useEffect(() => {
        const handler = (chat) => {
            queryClient.setQueryData(["previousChatUsers"], (old) => {
                if (!old) return old;

                const filtered = old.data.filter(c => c._id !== chat._id);

                return {
                    ...old,
                    data: [chat, ...filtered]
                };
            })
        }
        socket.on("updateChat", handler)
        return () => socket.off("newMessage", handler)
    }, [queryClient])

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