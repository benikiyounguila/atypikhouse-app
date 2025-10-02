import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/ui/CheckoutForm';
import axiosInstance from '@/utils/axios';

const PaymentPage = () => {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(loadStripe('pk_test_51RhS6cPo6He34ehy3V4jacYLbetLg739qszTV0BB0wKKcAcKHztmiYwRQdpmWP4nV9QPvXqYfI8IGk6sj6uIvLUP00vyZTpdwy'));

    const getClientSecret = async () => {
      try {
        const response = await axiosInstance.post(`bookings/create-payment-intent/${id}`);
        console.log('Fetched clientSecret:', response.data.clientSecret);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };

    getClientSecret();
  }, [id]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
