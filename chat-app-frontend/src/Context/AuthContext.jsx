import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect } from 'react'
import { getMe } from '../Services/userAPI'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../Services/authAPI'
import { connectSocket, getSocket } from '../Lib/socket'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false
    })


    const me = data?.user ?? undefined

    useEffect(() => {
        connectSocket();
    }, [me])


    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries(["me"])
            localStorage.clear()
            navigate("/auth")
            connectSocket();
        }
    })

    const login = async () => {
        await queryClient.invalidateQueries(["me"])
        navigate("/")
    }
    const logout = () => {
        logoutMutation.mutate()
        getSocket().disconnect();
    }

    return (
        <AuthContext.Provider value={{ me, isLoading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)