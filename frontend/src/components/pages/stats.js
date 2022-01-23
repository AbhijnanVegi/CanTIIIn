import { Container, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Row, Col, Statistic, List }from 'antd'
import { getStats } from "../../services/order"

const Stats = () => {

    const [Stats, setStats] = useState({})

    useEffect(async () => {
        const res = await getStats()
        setStats(res.message)
        console.log(res.message)
    }, [])

    return (
        <>
            <Container maxWidth="sm">
                <Paper sx={{
                    backgroundColor: '#248BD9',
                    color: "#0B1F5D",
                    marginTop: "10%",
                    paddingY: "1rem",
                    paddingX: "1rem"
                }}>
                    <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>Statistics</Typography>
                    <Row>
                        <Col span={6} offset={2}>
                            <Statistic title="Total orders" value={ Stats.orders }/>
                        </Col>
                        <Col span={6} offset={2}>
                            <Statistic title="Completed orders" value={ Stats.completed }/>
                        </Col>
                        <Col span={6} offset={2}>
                            <Statistic title="Pending orders" value={ Stats.pending }/>
                        </Col>
                    </Row>
                    <Typography variant="h6" sx={{ paddingY: "1rem", color: "white" }} >Top sales</Typography>
                    <List itemLayout="horizontal"
                        dataSource={Stats.top}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta title={item.name} description={`Sales : ${item.count}`}
                                />
                            </List.Item>
                        )}
                    />
                </Paper>
            </Container>
        </>
    )
}

export default Stats