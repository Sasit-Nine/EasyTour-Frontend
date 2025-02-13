import React,{useState,useEffect} from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements,CardElement,useStripe,useElements } from "@stripe/react-stripe-js"
import CheckoutForm from "../components/CheckoutForm"
import { QUERY_PAYMENT_INTENT_ID } from "../../services/Graphql"
import { useQuery } from "@apollo/client"

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY)
const Payment = ({bookingID}) => {
    const [clientSecret,setClientSecret] = useState('')
    const {data:payment_intent_id} = useQuery(QUERY_PAYMENT_INTENT_ID,{
        variables:{
            "documentId": bookingID
        },
        context:{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        }
    })
    useEffect(()=>{
        if(payment_intent_id){
            setClientSecret(payment_intent_id.payment_intent_id)
        }
    },[payment_intent_id])

    return (
        <h1>Payment Page</h1>
    )
}
export default Payment