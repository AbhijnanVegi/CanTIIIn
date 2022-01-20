const express = require('express')
const router = express.Router()

const User  = require('../models/users')
const { Buyer, Vendor } = require('../models/types')
const { DateTime} = require('luxon')

router.post('/token', (req, res) => {
    res.send(req.user)
})

router.post('/profile', async (req, res) => {
    var user = await User.findOne({email : req.user.email})
    var profile
    if (req.user.type === "buyer") {
        profile = await Buyer.findOne({ email: req.user.email })
    }
    else {
        profile = await Vendor.findOne({ email: req.user.email })
    }

    var { name, ...prf } = { ...profile._doc }
    prf.shopname = name
    const { password, _id, __v, wallet, favourites, ...rest } = { ...user._doc, ...prf}

    res.send(rest)
})

router.post('/profile/update', async (req, res) => {
    const userUp = {
        name: req.body.name,
        number : req.body.number
    }

    User.updateOne({ email: req.user.email }, userUp, (err, doc) => {
        if (err)
            return res.json(err)    
    })

    if (req.user.type === "buyer") {
        const profileUp = {
            age: req.body.age,
            batch: req.body.batch
        }

        Buyer.updateOne({ email: req.user.email }, profileUp, (err, doc) => {
            if (err)
                return res.json({status: 1, error: err})    
        })
    } else {
        const profileUp = {
            opening: DateTime.fromISO(req.body.opening).toLocaleString(DateTime.TIME_24_SIMPLE),
            closing: DateTime.fromISO(req.body.closing).toLocaleString(DateTime.TIME_24_SIMPLE)
        }
         
        Vendor.updateOne({ email: req.user.email }, profileUp, (err, doc) => {
            if (err)
                return res.json({status: 1, error: err})    
        })
    }

    return res.json({status: 0, message: "Profile updated successfully"})
    
})

module.exports = router