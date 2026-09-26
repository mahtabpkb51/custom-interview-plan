import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

// ==========REGISTER=================
export const register = async ({ username, email, password }) => {
    const response = await api.post(
        "/api/auth/register",
        {
            username,
            email,
            password
        }
    )

    return response.data
}

// ==========LOGIN=================
export const login = async ({ email, password }) => {
    const response = await api.post(
        "/api/auth/login",
        {
            email,
            password
        }
    )

    return response.data
}

// ==========LOGOUT=================
export const logout = async () => {
    const response = await api.get(
        "/api/auth/logout"
    )

    return response.data
}

// ==========GET CURRENT USER=================
export const getMe = async () => {
    const response = await api.get(
        "/api/auth/get-me"
    )

    return response.data
}

// ==========UPDATE PROFILE=================
export const updateProfile = async ({ username, email }) => {
    const response = await api.put(
        "/api/auth/update-profile",
        {
            username,
            email
        }
    )

    return response.data
}

// ==========CHANGE PASSWORD=================
export const changePassword = async ({
    currentPassword,
    newPassword
}) => {
    const response = await api.put(
        "/api/auth/change-password",
        {
            currentPassword,
            newPassword
        }
    )

    return response.data
}