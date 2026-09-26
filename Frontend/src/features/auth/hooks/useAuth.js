import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
    login,
    register,
    logout,
    getMe,
    updateProfile,
    changePassword
} from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    // ==========LOGIN=================
    const handleLogin = async ({ email, password }) => {
        setLoading(true)

        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    // ==========REGISTER=================
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)

        try {
            const data = await register({
                username,
                email,
                password
            })

            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    // ==========LOGOUT=================
    const handleLogout = async () => {
        setLoading(true)

        try {
            await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    // ==========UPDATE PROFILE=================
    const handleUpdateProfile = async ({ username, email }) => {
        setLoading(true)

        try {
            const data = await updateProfile({
                username,
                email
            })

            setUser(data.user)

            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    // ==========CHANGE PASSWORD=================
    const handleChangePassword = async ({
        currentPassword,
        newPassword
    }) => {
        setLoading(true)

        try {
            const data = await changePassword({
                currentPassword,
                newPassword
            })

            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    // ==========GET CURRENT USER=================
    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword
    }
}