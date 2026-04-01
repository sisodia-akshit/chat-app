import "../../Styles/Chat.css"

import UserCard from "../cards/UserCard";
import ButtonGoBack from "../common/ButtonGoBack";
import Messages from "./Messages";
import SendMessageForm from "../form/SendMessageForm";
import { useEffect, useRef, useState } from "react";
import { getPrivateMessage } from "../../Services/MessageAPI";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../Lib/socket";
import ProfileUserDetails from "../common/ProfileUserDetails";

function Chat({ id, receiver, chatId }) {
    const queryClient = useQueryClient();
    const socket = getSocket();

    const [content, setContent] = useState("")
    const [scroll, setScroll] = useState(true);

    const chatRef = useRef();



    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["messages", id],
        queryFn: ({ pageParam = 20, signal }) =>
            getPrivateMessage({ id: chatId, limit: pageParam, signal }),

        getNextPageParam: (lastPage, pages) => {
            const totalLoaded =
                pages.flatMap(p => p.data)
                    .filter((msg, index, self) =>
                        index === self.findIndex((m) => m._id === msg._id)
                    ).length;


            return totalLoaded < lastPage.count
                ? totalLoaded + 20
                : undefined;
        },
    });

    const messages = data?.pages
        .flatMap((page) => page.data)
        .filter((msg, index, self) =>
            index === self.findIndex((m) => m._id === msg._id)
        ) ?? [];

    const messageScrollHandler = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isAtTop = scrollTop <= -(scrollHeight - clientHeight - 1);

        if (!isFetchingNextPage && hasNextPage && isAtTop && scroll) {
            setScroll(false)
            setTimeout(() => {
                fetchNextPage();
                setScroll(true)
            }, 400)
        }
    }

    useEffect(() => {
        const handler = (message) => {
            socket.emit("seenMessage", { chatId, receiverId: id })

            queryClient.setQueryData(["messages", id], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page, index) => {
                        if (index === 0) {
                            return {
                                ...page,
                                data: [message, ...page.data],
                            };
                        }
                        return page;
                    }),
                };
            })

        }
        socket?.on("newMessage", handler)

        return () => socket.off("newMessage", handler)
    }, [queryClient, id])


    useEffect(() => {
        const handler = (message) => {
            queryClient.setQueryData(["messages", id], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page, index) => {
                        if (index === 0) {
                            return {
                                ...page,
                                data: page.data.map(curr => {
                                    return {
                                        ...curr,
                                        seen: true
                                    }
                                }),
                            };
                        }
                        return page;
                    }),
                };
            })

        }
        socket?.on("updateSeen", handler)

        return () => socket.off("updateSeen", handler)
    }, [queryClient, id])

    return (
        <div className="chat">
            {/* head  */}
            <div className="chat-top">
                <ButtonGoBack />

                <UserCard receiver={receiver} >
                    {/* <FaEllipsisV /> */}
                </UserCard>
            </div>

            {/* main  */}
            <div ref={chatRef} className="chat-main" onScroll={messageScrollHandler}>
                <Messages receiver={receiver} id={id} content={content} messages={messages} />
                {isFetchingNextPage || !scroll && <div className="loader"></div>}
                {/* <br /> */}
                {/* {messages.length < 20 && <ProfileUserDetails user={receiver} />} */}
            </div>

            {/* input  */}
            <SendMessageForm receiver={receiver} id={id} chatId={chatId} content={content} setContent={setContent} />
        </div>
    )
}

export default Chat