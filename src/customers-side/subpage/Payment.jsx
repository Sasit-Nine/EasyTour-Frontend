import React,{useState,useEffect} from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "../components/CheckoutForm"

const stripePromise = loadStripe('pk_test_51QonEPIWEaT6Ne0pj3UXokPyIxDxAJcMOEuAzQIiofUNRykm5hJm1VIJKAzpJVy3owIuXAqUoCLjxVstUn2nOctT00FnIaEqxx')
const Payment = ({bookingID}) => {
    const [clientSecret,setClientSecret] = useState('')
    useEffect(()=>{
        // const createPaymentIntent = async () => {
        //     try{
        //         const {data:payment_intent_id,error:erroridpayment,loading:loadingid} =
        //     }
        // }
    })

    return (
        <h1>Payment Page</h1>
    )
}
export default Payment