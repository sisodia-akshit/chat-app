import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { getMe } from '../Services/userAPI'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../Services/authAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        // retry: false,
    })

    const me = data?.user ?? undefined

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["me"])
        }
    })

    const login = () => {
        queryClient.invalidateQueries(["me"])
        navigate("/")
    }
    const logout = () => {
        logoutMutation.mutate()
        queryClient.invalidateQueries(["me"])
        navigate("/auth")

    }

    return (
        <AuthContext.Provider value={{ me, isLoading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)