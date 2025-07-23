import express from 'express';
// Add updateTransaction to the import
import { addTransaction, getTransactions, deleteTransaction, updateTransaction } from '../controllers/transactionController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect, addTransaction).get(protect, getTransactions);

// Add the PUT route to the existing line for /:id
router.route('/:id').delete(protect, deleteTransaction).put(protect, updateTransaction);

export default router;