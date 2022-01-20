import { Grid, Container, Paper, Typography, TextField, Alert } from "@mui/material"
import { Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoginUser } from "../../services/auth"

const LoginForm = () => {

    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        const res = await LoginUser(e)
        if (res.status === 1) {
            message.error(res.error)
            form.setFieldsValue({
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
        <Container maxWidth="xs">
            <Paper sx={{
                backgroundColor: '#248BD9',
                color: "#0B1F5D",
                marginTop: "30%",
                paddingY: "1rem",
            }}>
                <Typography variant="h4" align="center" sx={{ paddingBottom: "1rem", color: "white" }}>LOGIN</Typography>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ offset:5, span: 14 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    size="large"
                    autoComplete="off">

                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email address!' }, { type: 'email', message: "Enter a valid email address" }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Paper>
        </Container >
    )
}

export default LoginForm