import { useEffect } from 'react'
import Layout from '../Components/layout/Layout'
import Chats from '../Components/ui/Chats'
import Chat from '../Components/ui/Chat'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrCreateChat } from '../Services/chatsApi'
import Loading from '../Components/ui/Loading'
import { getSocket } from '../Lib/socket'
import { getUserById } from '../Services/userAPI'

function PrivateMessages() {
  const { id } = useParams();
  const socket = getSocket();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getOrCreateChat({ id }),
  })
  const chat = data?.data ?? {}

  const data2 = useQuery({
    queryKey: ["receiver", id],
    queryFn: () => getUserById(id)
  })
  const receiver = data2?.data?.data ?? {}

  useEffect(() => {
    if (!chat?._id) return;

    const join = () => {
      socket.emit("joinChat", chat._id);
    };

    if (socket.connected) join();

    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
    };

  }, [chat?._id])

  if (isLoading) return <Loading margin={true} />
  return (
    <Layout>
      <div className="privateMessage-prevChats-page">
        <Chats activeId={id} />
      </div>
      <div className="privateMessage-chat-page">
        <Chat id={id} chatId={chat._id} receiver={receiver} />
      </div>
    </Layout>
  )
}

export default PrivateMessages