import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test',
  { apiVersion: '2020-03-02' },
);

const events = stripe.events.list({
  type: 'checkout.session.completed',
  created: {
    // Check for events created in the last 24 hours.
    gte: Math.floor((Date.now() - 24 * 60 * 60 * 1000)/1000),
  },
});

// For older versions of Node, see https://github.com/stripe/stripe-node/#auto-pagination
for await (const event of events) {
  const session = event.data.object;

  // Fulfill the purchase...
  handleCheckoutSession(session);
}
