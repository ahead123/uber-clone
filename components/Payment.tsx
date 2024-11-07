import { useAuth } from '@clerk/clerk-expo';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useLocationStore } from '@/store';
import { PaymentProps } from '@/types/type';

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const [success, setSuccess] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const confirmHandler = async (
    paymentMethod,
    shouldSavePaymentMethod,
    intentCreationCallback,
  ) => {
    // Make a request to your own server, passing paymentMethod.id and shouldSavePaymentMethod.
    const { paymentIntent, customer } = await fetchAPI(
      '/(api)/(stripe)/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName || email.split('@')[0],
          email: email,
          amount: amount,
          paymentMethodId: paymentMethod.id,
        }),
      },
    );

    if (paymentIntent.clientSecret) {
      const { result } = await fetchAPI('/(api)/(stripe)/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customer,
        }),
      });
      if (result.client_secret) {
      }
    }

    const { client_secret, error } = await response.json();
    if (client_secret) {
      intentCreationCallback({ clientSecret: client_secret });
    } else {
      intentCreationCallback({ error });
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: 'USD',
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      // handle error
    }
  };

  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  // const didTapCheckoutButton = async () => {
  //   // implement later
  // };
  // return (
  //   <View>
  //     <Button title="Checkout" onPress={didTapCheckoutButton} />
  //   </View>
  // );

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error: ${error.code}, ${error.message}`);
    } else {
      setSuccess(true);
    }
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
