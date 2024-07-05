import  express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

import OpenAIAPI from './openai.js';

import cors from 'cors';
import config from './config.js';
import morgan from 'morgan';
import winston from 'winston';



/**
 * Set up Winston logger
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'chatbot-server' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

/**
 * Create Express app
 */
const app = express();
const port = config.port || 3000;

/**
 * Middleware
 */

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));


/**
 * Routes
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Route to handle chatbot requests
 * @param {string} req.body.userMessage - The user's message
 * @returns {Object} JSON response with chatbot response
 */
app.post('/getChatbotResponse', async (req, res) => {
  try {
    const userMessage = req.body.userMessage;

    // Validate user input
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid user message' });
    }

    // Use OpenAI API to generate a response
    const chatbotResponse = await OpenAIAPI.generateResponse(userMessage);

    // Send the response back to the client
    res.json({ chatbotResponse });
  } catch (error) {
    logger.error(`Error generating chatbot response: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate chatbot response' });
  }
});

/**
 * Start the server
 */
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app; // Export the app for testing
