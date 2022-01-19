import { Grid, Container, Paper, Typography, TextField, Button, Alert, Switch, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import RegisterUser from "../../services/auth"

const RegisterForm = () => {

    const navigate = useNavigate()

    const [error, setError] = useState({
        status: false,
        message: ""
    })

    const [vendor, setVendor] = useState(false)

    const [register, setRegister] = useState({
        email: "",
        password: "",
        name: "",
        number: "",
        age: 0,
        batch: "",
        shopname: "",
        opening: 0,
        closing: 0
    })

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await RegisterUser(register)
        if (res.status === 1) {
            setError({
                status: true,
                message: res.error
            })
            setRegister({
                email: "",
                password: "",
                name: "",
                number: "",
                age: 0,
                batch: "",
                shopname: "",
                opening: 0,
                closing: 0
            })
        }
        else {
            navigate("/login")
        }
    }

    const handleSwitch = (e) => {
        setVendor(e.target.checked)
        console.log(vendor)
    }

    return (
        <Container maxWidth="sm">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "20%",
                paddingBottom: "2rem",
            }}>
                <form onSubmit={handleSubmit}>
                    <Grid container align={"center"} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Register</Typography>
                        </Grid>
                        {error.status &&
                            <Grid item xs={12}>
                                <Alert sc={{
                                    backgroundColor: 'skyblue',
                                    paddingX: "10rem",
                                    color: "red"
                                }} severity="error">{error.message}</Alert>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: "#142F85" }
                            }} name="name" value={register.name} onChange={handleChange} label="Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: "#142F85" }
                            }} name="email" value={register.email} onChange={handleChange} label="Email address" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: "#142F85" }
                            }} name="password" value={register.password} onChange={handleChange} label="Password" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField sx={{
                                input: { color: "#142F85" }
                            }} name="number" value={register.number} onChange={handleChange} label="Phone Number" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            Buyer<Switch checked={vendor} onChange={handleSwitch} color="secondary" />Vendor
                        </Grid>

                        {!vendor &&
                            <>
                                <Grid item xs={12}>
                                    <TextField sx={{
                                        input: { color: "#142F85" }
                                    }} name="age" value={register.age} onChange={handleChange} label="Age" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ width: "42%" }}>
                                        <InputLabel id="demo-simple-select-label">Batch</InputLabel>
                                        <Select
                                            sx={{ input: { color: "#142F85" } }}
                                            name="batch"
                                            value={register.batch}
                                            label="Batch"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={"UG1"}>UG1</MenuItem>
                                            <MenuItem value={"UG2"}>UG2</MenuItem>
                                            <MenuItem value={"UG3"}>UG3</MenuItem>
                                            <MenuItem value={"UG4"}>UG4</MenuItem>
                                            <MenuItem value={"UG5"}>UG5</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        }
                        {vendor &&
                            <>
                                <Grid item xs={12}>
                                    <TextField sx={{
                                        input: { color: "#142F85" }
                                    }} name="shopname" value={register.shopname} onChange={handleChange} label="Shop Name" variant="outlined" />
                                </Grid>
                                <Grid>
                                </Grid>
                            </>
                        }

                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default RegisterForm