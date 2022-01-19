import { Grid, Container, Box, Paper, Typography, TextField, Button, Alert } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginUser from "../../services/auth"

const LoginForm = () => {

    const navigate = useNavigate()

    const [error, setError] = useState({
        status: false,
        message:""
    })

    const [login, setLogin] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await LoginUser(login)
        if (res.status === 1) {
            setError({
                status: true,
                message: res.error
            })
            setLogin({
                email: "",
                password: ""
            })
        }
        else {
            window.localStorage.setItem('Authorization', 'Bearer ' + res.token);
            navigate("/")
        }
    }


    return (
        <Container maxWidth="sm">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "30%",
                paddingBottom: "2rem",
            }}>
                <form onSubmit={handleSubmit}>
                    <Grid container align={"center"} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Login</Typography>
                        </Grid>
                        {error.status &&
                            <Grid item xs={12}>
                                <Alert sx={{
                                    backgroundColor: 'skyblue',
                                    paddingX: "10rem",
                                    color: "red"
                                }} severity="error">{error.message}</Alert>
                            </Grid> }
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: '#142F85' }
                            }} name="email" value={login.email} label="Email address" variant="outlined" onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: '#142F85' }
                            }} name="password" value={login.password} type="password" label="Password" variant="outlined" onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit">
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container >
    )
}

export default LoginForm