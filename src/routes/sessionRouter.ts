import express from 'express';
const sessionRoutes = express.Router();

sessionRoutes.get('/', (req, res) => {
  // Logic to fetch session data
  res.json({ id: 1, name: 'Sample Session' });
});

export default sessionRoutes;

