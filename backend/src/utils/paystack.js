const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackRequest = async (path, options = {}) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { success: false, message: 'Paystack is not configured on this server' };
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const body = await response.json();

    if (!response.ok || !body.status) {
      return {
        success: false,
        message: body.message || 'Paystack request failed',
      };
    }

    return { success: true, data: body.data };
  } catch (error) {
    console.error('Paystack request failed:', error.message);
    return { success: false, message: 'Unable to reach Paystack' };
  }
};

const initializeTransaction = async (email, amount, reference, metadata = {}) => {
  const amountInKobo = Math.round(Number(amount) * 100);
  if (!Number.isSafeInteger(amountInKobo) || amountInKobo <= 0) {
    return { success: false, message: 'Invoice amount is invalid' };
  }

  const result = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      currency: 'NGN',
      metadata,
      callback_url: `${(process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '')}/payment/verify`,
    }),
  });

  if (!result.success) return result;
  return {
    success: true,
    data: result.data,
    authorizationUrl: result.data.authorization_url,
  };
};

const verifyTransaction = async (reference) => {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
};

module.exports = { initializeTransaction, verifyTransaction };
