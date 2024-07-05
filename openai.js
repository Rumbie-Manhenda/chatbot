import fetch from 'node-fetch';
import AnthropicAPIKey from './config.js'; 

class OpenAIAPI {
    static async generateResponse(userMessage) {
        const apiKey = AnthropicAPIKey;
        const endpoint = 'https://api.anthropic.com/v1/completions';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                prompt: userMessage,
                max_tokens: 200,
                temperature: 0.7,
                model: 'claude-v1',
            }),
        });

        const responseData = await response.json();

        if (response.ok) {
            if (responseData.completion) {
                return responseData.completion;
            } else {
                console.error('Error: No valid response from Anthropic API');
                return 'Sorry, I couldn\'t understand that.';
            }
        } else {
            console.error('Error generating chatbot response:', responseData.error);
            return 'Sorry, I couldn\'t understand that.';
        }
    }
}

export default OpenAIAPI;
