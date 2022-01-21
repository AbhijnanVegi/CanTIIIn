var express =  require("express")
var router = express.Router()

const { DateTime } = require("luxon")

const Order = require("../models/orders")
const Product =  require("../models/products")
const {Buyer, Vendor} = require("../models/types")

router.post('/new', async (req, res) => {
    if (req.user.type !== "buyer") {
        return res.status(201).json({status:1, error:"Unauthorised"})
    }
    console.log(req.body)

    const product = await Product.findById(req.body.productId)

    if (!product) {
        return res.status(200).json({status:1,error: "Product not found"})
    }
    if (req.body.quantity <= 0)
        return res.status(400).json({status:1,error: "Quantity must be positive"})

    var total = product.price
    var addons = []
    if (req.body.addons) {
        product.addons.forEach(addon => {
            if (req.body.addons.includes(addon._id.toString())) {
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
        return res.status(200).json({ status:1, error: "Insufficient balance" })
    }
    else {
        buyer.wallet -= total
    }

    var now = new Date()
    // now = now.getHours() * 60 + now.getMinutes()

    const vendor = await Vendor.find({name : product.vendor})
    const opening = DateTime.fromISO(vendor.opening)
    const closing = DateTime.fromISO(vendor.closing)
    console.log(vendor)
    if (
        (opening < closing && (now < opening || now > closing)) ||
        (opening > closing && (now < opening && now > closing))
    ) 
    {
        return res.status(200).json({status:1,error: "Vendor is closed"})
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
            return res.status(200).json({status : 1, error: err})
        }
        buyer.save()
        return res.status(201).json({status:0,message: "Order placed successfully"})
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
