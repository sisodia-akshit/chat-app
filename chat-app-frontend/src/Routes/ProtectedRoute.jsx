import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"
import Layout from "../Components/layout/Layout";
import Loading from "../Components/ui/Loading";
import Error from "../Components/ui/Error";


function ProtectedRoute({ children }) {
    const { me, isLoading, error } = useAuth();

    const navigate = useNavigate();

    if (!me) navigate("/auth")
    if (isLoading) return <Loading />
    if (error) return <Error error={error} />
    return (
        <>{children}</>
    )
}

export default ProtectedRoute