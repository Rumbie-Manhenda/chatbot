const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        // Display user's message
        displayMessage('user', message);
        // Call OpenAI API to get chatbot's response
        getChatbotResponse(message);
        // Clear user input
        userInput.value = '';
    }
}

function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    // Sanitize the message to prevent XSS
    const sanitizedMessage = sanitizeHTML(message);
    // Wrap the sanitized message in a <p> tag
    const messageParagraph = document.createElement('p');
    messageParagraph.innerText = sanitizedMessage;
    // Append the <p> tag to the message element
    messageElement.appendChild(messageParagraph);
    chatLog.appendChild(messageElement);
}

function getChatbotResponse(userMessage) {
    // Make a request to your server with the user's message
    fetch('http://localhost:3000/getChatbotResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Display chatbot's response
        displayMessage('chatbot', data.chatbotResponse);
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('chatbot', 'Sorry, there was an error processing your request. Please try again later.');
    });
}

function sanitizeHTML(html) {
    // Create a new DOMPurify instance
    const purify = window.DOMPurify(window);

    // Sanitize the HTML
    const sanitizedHTML = purify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    return sanitizedHTML;
}

