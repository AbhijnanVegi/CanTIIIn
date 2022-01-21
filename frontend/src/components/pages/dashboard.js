import { Container, Paper, Typography } from '@mui/material'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


import BuyerDashboard from "../templates/BuyerDashboard"

import { getUser } from '../../services/auth'

const Dashboard = () => {

    const [IsBuyer, setIsBuyer] = useState(true);
    const navigate = useNavigate()
    
    useEffect(async () => {
        const u = await getUser()
        if (!u) navigate('/login')
        if (u.type === 'vendor') {
            setIsBuyer(false)
        }
    }, [])

    return (
        <Container maxWidth="xl">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "1%",
                paddingY: "2rem",
                paddingX:"1rem"
            }}>
            <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>Dashboard</Typography>
            {IsBuyer ? <BuyerDashboard /> : <></>}
            </Paper>
        </Container>
    )
}

export default Dashboard