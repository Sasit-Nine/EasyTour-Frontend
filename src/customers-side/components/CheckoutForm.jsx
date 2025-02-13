import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import React from "react"

const CheckoutForm = ({clientSecret}) => {
    const stripe = useStripe()
    const elemnet = useElements()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!stripe || !elemnet) {
            return
        }
        const CardElement = elemnet.getElement(CardElement)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: CardElement
            }
        })
        if (error) {
            console.error(error)
        } else if (paymentIntent.status === 'succeeded') {
            console.assert('Payment Success', paymentIntent)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
            <CardElement></CardElement>
            <button type="submit" disabled={!stripe} CassName="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Pay Now
            </button>
        </form>
    )
}
export default CheckoutForm;