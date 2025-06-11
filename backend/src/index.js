import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/verify', (req, res) => {
  const { address, message, signature } = req.body;

  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
