import express from 'express';
// const express = require('express');
const router = express.Router();

// crear nueva API key
router.post('/', (req, res) => {
  const { key } = req.body;
  res.status(201).json({ message: 'API Key created', key });
});

export default router;
// module.exports = router;

