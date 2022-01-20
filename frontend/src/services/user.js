import axios from 'axios'

import { setToken } from './auth'

axios.defaults.baseURL = "http://localhost:4000/api"

const GetUserProfile = async () => {
    setToken()
    const res = await axios.post("/user/profile")

    return res.data
}

const UpdateUserProfile = async (user) => {
    setToken()
    const res = await axios.post("/user/profile/update", user)

    return res.data
}

export { GetUserProfile, UpdateUserProfile }