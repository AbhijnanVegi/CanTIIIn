import { Button, Table, Tag, Input, Switch, Row, Col, message, Modal, Form, Select } from 'antd'
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"

import { getProductList, placeOrder } from '../../services/product'

const BuyerDashboard = () => {

    const [Products, setProducts] = useState([])

    const [form] = Form.useForm()

    const [VegFilter, setVegFilter] = useState(false)
    const [Search, setSearch] = useState('')
    const [VendorFilter, setVendorFilter] = useState([])
    const [TagFilter, setTagFilter] = useState([])
    const [PriceFilter, setPriceFilter] = useState("0;9999999")

    const [Visible, SetVisible] = useState(false)
    const [BuyProduct, SetBuyProduct] = useState({})

    const [CanFilter, setCanFilter] = useState([
        {
            text: 'JC',
            value: 'JC',
        },
        {
            text: 'BBC',
            value: 'BBC'
        }
    ])


    const onVegFilterChange = (checked) => {
        setVegFilter(checked)
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleMin = (e) => {
        const f = PriceFilter.split(';')
        const min = e.target.value
        setPriceFilter(min + ';' + f[1])
    }

    const handleMax = (e) => {
        const f = PriceFilter.split(';')
        var max = e.target.value
        if (max === '') max = "9999999"
        setPriceFilter(f[0] + ';' + max)
    }

    const handleBuy = (id) => {
        const p = Products.filter((p) => (p._id === id))
        SetBuyProduct(p[0])
        SetVisible(true)
    }

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setTagFilter(filters.tags)
        setVendorFilter(filters.vendor)
    };

    const handleSubmit = async (d) => {
        var data = d
        data.productId = BuyProduct._id
        const res = await placeOrder(data)
        console.log(res)
        if (res.status === 1)
            message.error(res.error)
        else
            message.success('Order placed successfully')
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            onFilter: (value, record) => value ? record.name.toLowerCase().includes(value.toLowerCase()) : true,
            filteredValue: [Search]
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            filters: CanFilter,
            onFilter: (value, record) => record.vendor.includes(value),
            filteredValue: VendorFilter
        },
        {
            title: 'Type',
            dataIndex: 'isnv',
            key: 'isnv',
            render: isnv => isnv ? 'Non-Veg' : 'Veg',
            onFilter: (value, record) => !(record.isnv && (value === 'true')),
            filteredValue: [VegFilter]
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = 'geekblue';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
            filters: [
                {
                    text: "Cold",
                    value: "cold"
                },
                {
                    text: "Hot",
                    value: "hot"
                },
                {
                    text: "Drink",
                    value: "drink"
                }
            ],
            onFilter: (value, record) => record.tags.includes(value),
            filteredValue: TagFilter
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => {
                return <>{rating.count ? rating.total / rating.count : 0}</>
            },
            sorter: (a, b) => a.rating.count ? a.rating.total / a.rating.count : 0 - b.rating.count ? b.rating.total / b.rating.count : 0,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            onFilter: (value, record) => {
                const f = value.split(';')
                const min = f[0]
                const max = f[1]

                return (record.price >= min && record.price <= max)
            },
            filteredValue: [PriceFilter]
        },
        {
            title: 'Buy',
            key: 'buy',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => { handleBuy(record._id) }}>Buy</Button>
                </>
            )
        }
    ]

    useEffect(() => {
        async function getProducts() {
            const data = await getProductList()
            setProducts(data)
        }
        getProducts()
    }, [])

    return (
        <>
            <Row>
                <Col style={{ paddingBottom: "5px" }} span={6}>
                    <Input.Search onChange={handleSearch} />
                </Col>
                <Col span={8} offset={2}>
                    <Input.Group compact>Price : <Input placeholder='Min' style={{ width: "20%" }} onChange={handleMin} /><Input placeholder='Max' style={{ width: "20%" }} onChange={handleMax} /></Input.Group>
                </Col>
                <Col span={2} offset={6}>
                    <p style={{ color: "white" }}>Veg : <Switch onChange={onVegFilterChange} /></p>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={Products}
                pagination={{ position: ["none", "none"] }}
                onChange={handleChange}>

            </Table>
            <Modal title={"Buy " + BuyProduct.name} visible={Visible}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleSubmit(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => { SetVisible(false); form.resetFields() }}>
                <Form
                    form={form}
                    title={"Buy " + BuyProduct.name}
                    layout="vertical"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="quantity"
                        rules={[{ required: true, message: "Enter a quantity" }, { pattern: "[1-9][0-9]*", message: "Enter a valid quantity" }]}
                    >
                        <Input placeholder='Quantity' />

                    </Form.Item>
                    <Form.Item
                        name="addons"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Addons"
                        >
                            {BuyProduct.name &&
                                BuyProduct.addons.map((a, i) => { console.log(a, i); return <Select.Option value={a._id} label={a.name}>{a.name} {a.price}rs</Select.Option> })
                            }

                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default BuyerDashboard
