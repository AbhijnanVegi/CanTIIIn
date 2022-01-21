import { Button, Table, Tag, Input, Switch, Row, Col } from 'antd'
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"

import { getProductList } from '../../services/product'

const BuyerDashboard = () => {

    const [Products, setProducts] = useState([])

    const [VegFilter, setVegFilter] = useState(false)
    const [Search, setSearch] = useState('')
    const [VendorFilter, setVendorFilter] = useState([])
    const [TagFilter, setTagFilter] = useState([])

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

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setTagFilter(filters.tags)
        setVendorFilter(filters.vendor)
    };

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
        },
        {
            title: 'Buy',
            key: 'buy',
            render: (text, record) => (
                <>
                    <Button type="primary">Buy</Button>
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
                <Col span={2} offset={16}>
                    <p style={{ color: "white" }}>Veg : <Switch onChange={onVegFilterChange} /></p>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={Products}
                pagination={{ position: ["none", "none"] }}
                onChange={handleChange}>

            </Table>
        </>
    )
}

export default BuyerDashboard
