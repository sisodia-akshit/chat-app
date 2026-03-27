import React, { useEffect } from 'react'
import Layout from '../Components/layout/Layout'
import Chats from '../Components/ui/Chats'
import Chat from '../Components/ui/Chat'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrCreateChat } from '../Services/chatsApi'
import Loading from '../Components/ui/Loading'
import socket from '../Lib/socket'

function PrivateMessages() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getOrCreateChat({ id }),
    keepPreviousData: true,
  })
  const chat = data?.data ?? {}
  useEffect(() => {
    if (!chat?._id) return;

    const join = () => {
      socket.emit("joinChat", chat._id);
    };

    if (socket.connected) join();

    socket.on("connect", join);

    return () => {
      socket.emit("leaveChat", chat._id);
      socket.off("connect", join);
    };

  }, [chat?._id])

  if (isLoading) return <Loading />
  return (
    <Layout>
      <div className="privateMessage-prevChats-page">
        <Chats activeId={id} />
      </div>
      <div className="privateMessage-chat-page">
        <Chat id={id} chatId={chat._id} user={chat} />
      </div>
    </Layout>
  )
}

export default PrivateMessages