var express =  require("express")
var router = express.Router()

const Order = require("../models/orders")
const Product =  require("../models/products")
const {Buyer, Vendor} = require("../models/types")

router.post('/new', async (req, res) => {
    if (req.user.type !== "buyer") {
        return res.status(401).json({message: "Unauthorised"})
    }

    const product = await Product.findById(req.body.productId)
    const addonsreq = JSON.parse(req.body.addons)

    console.log(req.body)

    if (!product) {
        return res.status(404).json({message: "Product not found"})
    }
    if (req.body.quantity <= 0)
        return res.status(400).json({message: "Quantity must be positive"})

    var total = product.price
    var addons = []
    if (addonsreq) {
        product.addons.forEach(addon => {
            if (addonsreq.includes(addon._id.toString())) {
                addons.push(addon)
                total += addon.price
            }
            else 
                console.log("Addon not added")
        })
    }
    total = total * req.body.quantity
    
    var buyer = await Buyer.findOne({ email: req.user.email })
    if (buyer.wallet < total) {
        return res.status(400).json({ message: "Insufficient balance" })
    }
    else {
        buyer.wallet -= total
    }

    var now = new Date()
    now = now.getHours() * 60 + now.getMinutes()

    const vendor = await Vendor.find({name : product.vendor})
    console.log(vendor)
    if (
        (vendor.opening < vendor.closing && (now < vendor.opening || now > vendor.closing)) ||
        (vendor.opening > vendor.closing && (now < vendor.opening && now > vendor.closing))
    ) 
    {
        return res.status(400).json({message: "Vendor is closed"})
    }

    var order = new Order({
        buyer: buyer.email,
        vendor: product.vendor,
        item: {
            name: product.name,
            price: product.price,
            addon: addons
        },
        quantity: req.body.quantity,
        total: total
    })

    order.save((err) => {
        if (err) {
            return res.status(500).json(err)
        }
        buyer.save()
        return res.status(201).json({message: "Order placed successfully"})
    })

})

router.get('/my', async (req, res) => {
    if (req.user.type === "buyer")
        var user = await Buyer.find({email : req.user.email})
    else
        var user = await Vendor.find({ email: req.user.type })
    
    var orders

    if (req.user.type === "buyer")
        orders = await Order.find({ buyer: req.user.email })
    else
        orders = await Order.find({ vendor: user.name })
    return res.status(200).json(orders)
})

module.exports = router
