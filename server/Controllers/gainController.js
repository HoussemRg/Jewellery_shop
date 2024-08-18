const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { Gain } = require('../Models/Gain');
const { Product } = require('../Models/Product');
const { OrderDetails } = require('../Models/OrderDetails');


 /**---------------------------------
 * @desc calculate Gain 
 * @route /api/gain
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/

    const getGain = asyncHandler(async (req, res) => {
        const GainModel = req.storeDb.models.Gain || req.storeDb.model('Gain', Gain.schema);
    
        const gain = await GainModel.findOneAndUpdate(
            {},
            {},
            { new: true, upsert: true } 
        );
    
        if (!gain) {
            return res.status(404).send('Gain not found');
        }
    
        return res.status(200).send(gain);
    });

    const getGainPerYear=asyncHandler(async(req,res)=>{
        const ProductModel = req.storeDb.model('Product', Product.schema);
    const OrderDetailsModel = req.storeDb.model('OrderDetails', OrderDetails.schema);
    const { year } = req.params;
    let stats = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
        const startOfMonth = new Date(`${year}-${i + 1}-01`);
        const endOfMonth = new Date(`${year}-${i + 2}-01`);

        const gain = await OrderDetailsModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: endOfMonth
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: null,
                    totalGain: {
                        $sum: {
                            $subtract: [
                                "$price",
                                {
                                    $multiply: [
                                        "$quantity",
                                        "$productDetails.purchasePrice",
                                        "$productDetails.weight"
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        ]);

        stats.push({ month: months[i], gain: gain[0]?.totalGain || 0 });
    }

    return res.status(200).send(stats);
    })


module.exports={getGain,getGainPerYear}