const midtransClient = require("midtrans-client")
const { User, Order } = require('../models');
class PaymentController {
    static async getMidtransToken(req, res, next) {
        try {
            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            })

            let lastOrder = await Order.findOne({
                order: [["createdAt", "desc"]]
            })
            let lastId = lastOrder ? lastOrder.id + 1 : 1
            let order = await Order.create({
                orderId: "ORD-SUBS-" + Date.now() + lastId,
                UserId: req.user.id,
                amount: 100000,
                status: 'pending'
            })
            let parameter = {
                "transaction_details": {
                    "order_id": order.orderId,
                    "gross_amount": order.amount
                },
                "customer_details": {
                    "first_name": req.user.name,
                    "email": req.user.email,
                },
                "item_details": [
                    {
                        "id": "PREMIUM-DATINGER",
                        "price": order.amount,
                        "quantity": 1,
                        "name": "Datinger Premium",
                        "brand": "Datinger",
                        "category": "Subscription"
                    }
                ],
            }
            let response = await snap.createTransaction(parameter)
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getMidtransNotification(req, res, next) {
        try {
            let statusResponse = req.body
            let orderId = statusResponse.order_id;
            let transactionStatus = statusResponse.transaction_status;
            let fraudStatus = statusResponse.fraud_status;

            console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

            let order = await Order.findOne({
                where: {
                    orderId: orderId
                }
            })

            let successPayment = async () => {
                await order.update({
                    status: 'paid'
                })
                await User.update({
                    subscription: true
                }, {
                    where: {
                        id: order.UserId
                    }
                })
            }

            if (transactionStatus == 'capture') {
                if (fraudStatus == 'accept') {
                    await successPayment()
                }
            } else if (transactionStatus == 'settlement') {
                await successPayment()
            } else if (transactionStatus == 'cancel' ||
                transactionStatus == 'deny' ||
                transactionStatus == 'expire') {
                await order.update({
                    status: 'failure'
                })
            }
            res.status(200).json({ message: 'Payment Success' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = PaymentController