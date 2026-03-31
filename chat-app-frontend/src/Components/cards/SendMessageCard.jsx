import { decryptMessage } from "../../Hooks/useEncryptMessage"
import "../../Styles/Cards.css"
function SendMessageCard({ receiver, message, nonce }) {
    const content = decryptMessage(message, nonce, receiver?.publicKey, localStorage.getItem("privateKey"))
    return (
        <p className="sendMessageCard">
            {content}
        </p>
    )
}

export default SendMessageCard