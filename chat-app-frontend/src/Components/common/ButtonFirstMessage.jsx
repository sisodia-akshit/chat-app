import { useNavigate } from 'react-router-dom';

function ButtonFirstMessage({ id, user, children }) {
    const navigate = useNavigate();

    const buttonClickedHandler = (e) => {
        navigate(`/${id}`)
    }
    return (
        <button type='button' onClick={buttonClickedHandler} className="buttonFirstMessage">
            {children}
        </button>
    )
}

export default ButtonFirstMessage