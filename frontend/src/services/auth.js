import axios from "axios"

axios.defaults.baseURL = "http://localhost:4000/api"

const LoginUser = async (user) => {
    const res = await axios.post("/auth/login", user)

    if (res.data.status === 1) {
        console.log(res.data.error)
    }

    return res.data
}

export default LoginUser