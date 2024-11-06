import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from './CustomButton';

const Payment = () => {
  const openPaymentSheet = async () => {
    // Open PaymentSheet
  };
  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
