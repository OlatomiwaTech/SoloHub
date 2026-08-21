const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Initialize a Paystack transaction
 */
const initializeTransaction = async (email, amount, reference, metadata = {}) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        currency: 'NGN',
        metadata: {
          ...metadata,
          custom_fields: [
            ...(metadata.custom_fields || []),
          ],
        },
        callback_url: `${process.env.APP_URL}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      authorizationUrl: response.data.data.authorization_url,
    };
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Payment initialization failed',
    };
  }
};

/**
 * Verify a Paystack transaction
 */
const verifyTransaction = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Payment verification failed',
    };
  }
};

module.exports = {
  initializeTransaction,
  verifyTransaction,
};