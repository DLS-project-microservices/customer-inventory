import express from 'express';
import stripeService from '../services/stripeService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const { items } = req.body;
  
      const paymentIntent = await stripeService.createPaymentIntent(items);
  
      res.status(200).json(paymentIntent);
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

export default router;