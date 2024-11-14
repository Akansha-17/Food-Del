import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

// Function to open Razorpay payment
const openRazorpayPayment = (orderId, amount) => {
  const options = {
    key: process.env.RAZORPAY_KEY_ID, // Use REACT_APP_RAZORPAY_KEY_ID
    amount: amount * 100, // Amount in paisa
    currency: "INR",
    name: "SnackPoint",
    description: "Order Payment",
    order_id: orderId, // Razorpay order ID from backend
    handler: function (response) {
      alert("Payment Successful!");
      console.log("Payment ID:", response.razorpay_payment_id); 
      console.log("Order ID:", response.razorpay_order_id); 
      console.log("Signature:", response.razorpay_signature); 
      // Post payment verification to backend here
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "1234567890",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

    const [data, setData] = useState({
      firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: ""
    });

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({ ...data, [name]: value }));
    };
  
    const placeOrder = async (event) => {
      event.preventDefault();
      
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({ ...item, quantity: cartItems[item._id] }));
      
      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 50
      };

      try {
        const response = await axios.post(`${url}/api/order/place`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const { orderId, amount } = response.data;
          openRazorpayPayment(orderId, amount);
        } else {
          alert("Error placing order");
        }
      } catch (error) {
        console.error("Order error:", error);
        alert("Error placing order");
      }
    };

    return (
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <p className='title'>Delivery Information</p>
          <div className="multi-fields">
            <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
            <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
          </div>
          <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
          <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
            <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
            <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>SubTotal</p>
                <p>Rs.{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>Rs.{getTotalCartAmount() === 0 ? 0 : 50}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b>
              </div>
            </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    );
};

export default PlaceOrder;
