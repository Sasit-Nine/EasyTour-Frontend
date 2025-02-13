import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import React from "react"

const CheckoutForm = ({clientSecret}) => {
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!stripe || !elements) {
            return
        }
        const cardElement = elements.getElement(CardElement)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement
            }
        })
        if (error) {
            console.error(error)
        } else if (paymentIntent.status === 'succeeded') {
            console.log('Payment Success', paymentIntent)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
            <CardElement></CardElement>
            <button type="submit" disabled={!stripe} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Pay Now
            </button>
        </form>
    )
}
export default CheckoutForm;