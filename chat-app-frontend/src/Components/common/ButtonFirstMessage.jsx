import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendPrivateMessage } from '../../Services/MessageAPI'
import { useNavigate } from 'react-router-dom';
import { getOrCreateChat } from '../../Services/chatsApi';

function ButtonFirstMessage({ id, user, children }) {
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    const sendHelloMutaion = useMutation({
        // mutationFn: sendPrivateMessage,
        mutationFn: getOrCreateChat,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries(["messages"])
            navigate(`/${id}`)
        }
    })

    const buttonClickedHandler = (e) => {

        // sendHelloMutaion.mutate({ id, content: `Hello ${user?.name}` })
        sendHelloMutaion.mutate({ id })
    }
    return (
        <button type='button' onClick={buttonClickedHandler} className="buttonFirstMessage">
            {children}
        </button>
    )
}

export default ButtonFirstMessage