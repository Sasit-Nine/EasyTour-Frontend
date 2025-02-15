// import React,{useState,useEffect} from "react"
// import { loadStripe } from "@stripe/stripe-js"
// import { Elements,CardElement,useStripe,useElements } from "@stripe/react-stripe-js"
// import { QUERY_PAYMENT_DATA } from "../../services/Graphql"
// import { useQuery } from "@apollo/client"
// import { useLocation } from "react-router-dom"

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// const CheckoutForm = ({clientSecret})=>{
//     const stripe = useStripe()
//     const elements = useElements()
//     const [message,setMessage] = useState()

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         if (!stripe||!elements){
//             return
//         }
//         const cardElement = elements.getElement(CardElement)
//         const {paymentIntent,error} = await stripe.confirmCardPayment(clientSecret,{
//             payment_method: { card: cardElement }
//         })
//         if (error) {
//             setMessage(`Error: ${error.message}`)
//         } else if (paymentIntent.status === "succeeded") {
//             setMessage("Payment successful! 🎉")
//         } else {
//             setMessage(`Payment status: ${paymentIntent.status}`)
//         }
//     }
//     return (
//         <form onSubmit={handleSubmit}>
//             <CardElement />
//             <button type="submit" disabled={!stripe}>
//                 Pay Now
//             </button>
//             <p>{message}</p>
//         </form>
//     )
// }

// const Payment = () => {
//     console.log("STRIPE PUBLIC KEY:", import.meta.env.VITE_STRIPE_PUBLIC_KEY)
//     const location = useLocation()
//     const bookingID = location.state?.bookingID
//     const {data:paymentData,loading:loadingPayment,error:errorPayment} = useQuery(QUERY_PAYMENT_DATA,{
//         variables:{ documentId:bookingID},
//         context:{
//             headers:{
//                 Authorization:`Bearer ${sessionStorage.getItem('token')}`
//             }
//         }
//     })
//     if(loadingPayment){
//         return <p>Loading</p>
//     }
//     if(errorPayment){
//         return <p>{errorPayment}</p>
//     }
//     const clientSecret = paymentData?.booking?.client_secret
//     return(
//         <Elements stripe={stripePromise} options={{ clientSecret }}>
//             <h1>Payment</h1>
//             <p>Booking ID: {bookingID}</p>
//             {clientSecret ? <CheckoutForm clientSecret={clientSecret} /> : <p>Cannot find client secret</p>}
//         </Elements>
//     )
// }
// export default Payment