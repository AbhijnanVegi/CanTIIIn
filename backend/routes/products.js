var express = require("express")
var router = express.Router()

const Product = require("../models/products")
const { Buyer, Vendor } = require("../models/types")
const { DateTime } = require('luxon')

router.get('/', async (req, res) => {
    const vendors = await Vendor.find({})

    const buyer = await Buyer.findOne({email : req.user.email})

    const isOpen = (vendor) => {
        var now = new Date()
        const opening = DateTime.fromISO(vendor.opening)
        const closing = DateTime.fromISO(vendor.closing)

        return (!(
            (opening < closing && (now < opening || now > closing)) ||
            (opening > closing && (now < opening && now > closing))
        ))

    }

    var open = {}
    vendors.forEach((v) => open[v.name] = isOpen(v))

    const products = await Product.find({})

    var resJson = {
        afavourites: [],
        ufavourites: [],
        available: [],
        unavailable: [],
    }
    console.log(buyer)
    products.forEach((p) => {
        if (open[p.vendor]) {
            resJson.available.push(p)
            if (buyer.favourites.includes(p._id)) resJson.afavourites.push(p)
        }
        else {
            resJson.unavailable.push(p)
            if (buyer.favourites.includes(p._id)) resJson.ufavourites.push(p)
        }
    })
    
    return res.json({status:0, message: resJson})
})

router.post('/new', async (req, res) => {
    if (req.user.type !== "vendor") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    var vendor = await Vendor.findOne({ email: req.user.email })

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        isnv: req.body.isnv,
        vendor: vendor.name,
        addons: JSON.parse(req.body.addons),
        tags: JSON.parse(req.body.tags),
    })

    product.save((err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(201).json(product)
    })
})

router.post('/favourite', async (req, res) => {
    if (req.user.type !== "buyer") {
        return res.status(401).json({status:0, message: "Unauthorized" })
    }

    const product = await Product.findById(req.body.productId)

    if (!product) {
        return res.status(404).json({status:0, message: "Product not found" })
    }

    var buyer = await Buyer.findOne({ email: req.user.email })

    if (buyer.favourites.includes(product._id)) {
        buyer.favourites.splice(buyer.favourites.indexOf(product._id), 1)
    } else {
        buyer.favourites.push(product._id)
    }

    buyer.save((err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(201).json({status:0, message: "Favourite updated" })
    })

})

router.post('/rate', async (req, res) => {
    if (req.user.type !== "buyer") {
        return res.status(400).json({
            message: "Unauthorised"
        })
    }

    var product = await Product.findById(req.body.productId)
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        })
    }

    if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
        return res.status(200).json({
            message: "Bad rating"
        })
    }

    product.rating.count++
    product.rating.total += parseInt(req.body.rating)

    product.save((err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(201).json({ message: "Review added successfully" })
    })
})

module.exports = router
