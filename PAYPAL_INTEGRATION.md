# PayPal Integration Guide

## Overview
This grocery app now has full PayPal payment integration alongside Cash on Delivery (COD) option.

## Backend Setup

### 1. Environment Variables (.env)
Add PayPal credentials to your `.backend/.env` file:

```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # Use 'sandbox' for testing, 'live' for production
```

### 2. Get PayPal Credentials
1. Go to https://developer.paypal.com
2. Sign up or log in
3. Go to Apps & Credentials
4. Create a new app under Sandbox
5. Copy the Client ID and Secret
6. Add them to your .env file

### 3. Dependencies
The backend uses `axios` which is already installed. No additional packages needed!

## Frontend Setup

### 1. Cart Page Updates
The Cart component now includes:
- PayPal payment option selector
- `handlePayPalPayment()` function to initiate payment
- Support for both COD and PayPal payments

### 2. Payment Verification Page
A new route `/verify-payment` handles:
- PayPal callback after user approval
- Payment verification with backend
- Order confirmation and cart clearing

## How It Works

### Payment Flow:
1. **User selects PayPal** → Chooses delivery address
2. **Click "Proceed to PayPal"** → 
   - Backend creates PayPal order
   - Order saved as pending in DB
   - User redirected to PayPal approval page
3. **User approves payment on PayPal** →
   - Redirected back to `/verify-payment`
4. **Backend verifies payment** →
   - Captures the PayPal transaction
   - Updates order status to paid
   - Clears user cart
5. **Success** → User redirected to `/my-orders`

## API Endpoints

### New Endpoints:

#### Create PayPal Order
```
POST /api/order/paypal/create
Headers: Authorization (user token)
Body: {
  items: [{product: id, quantity: num}],
  address: addressId
}
Response: {
  success: true,
  orderId: mongoOrderId,
  paypalOrderId: paypalId,
  approvalUrl: paypalApprovalLink
}
```

#### Verify PayPal Payment
```
POST /api/order/paypal/verify
Headers: Authorization (user token)
Body: {
  orderId: mongoOrderId,
  paypalOrderId: paypalId
}
Response: {
  success: true,
  message: "Payment verified successfully",
  order: {...}
}
```

## Database Schema Updates

Order model now includes:
- `paypalOrderId`: Stores PayPal transaction ID
- `paymentStatus`: Tracks payment status (pending/completed)

## Testing

### Sandbox Testing:
1. Use PayPal Sandbox account credentials
2. Test with sandbox payment methods:
   - Email: sb-buyer@example.com
   - Use generated sandbox test credentials

### Test Flow:
1. Add products to cart
2. Select PayPal payment
3. Complete payment in PayPal
4. Verify redirect to `/verify-payment`
5. Check order in `/my-orders`

## Important Notes

⚠️ **Before Going Live:**
- Replace PAYPAL_MODE with 'live'
- Update PAYPAL_CLIENT_ID and SECRET with production keys
- Update URLs in production (return_url, cancel_url)
- Test thoroughly with sandbox first

## Troubleshooting

### Payment not verifying:
- Check PayPal credentials in .env
- Verify PAYPAL_MODE is 'sandbox' for testing
- Check localStorage for pending order data

### Redirect issues:
- Ensure return URLs are accessible
- Check CORS settings allow PayPal domain
- Verify user is authenticated before payment

## Support
For PayPal API documentation, visit: https://developer.paypal.com/docs/checkout/
