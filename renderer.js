const hljs = require('highlight.js');
const markdownit = require('markdown-it');
const md = markdownit();
const inputField = document.getElementById('entry-box');
const API_KEY = "AIzaSyAjtbqg0T4aTbqDnJPl8kIlRH9ZYr6v32g";

let messages = [];

const clearButton = document.getElementById('close-button');
clearButton.addEventListener('click', () => {
    messages = [];
    renderMessages();
})
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', onEnterPress);

function renderText(text) {
    str = md.render(text);
    return str;
}

function renderMessages() {
    const AI_UI = document.getElementById('AI-UI');
    AI_UI.innerHTML = messages.map((message, i) => {
        return `<div class="message ${i % 2 === 0 ? 'user' : 'bot'}">${renderText(message.text)}</div><br>`;
    }).join(''); // Join the array into a single string
    hljs.highlightAll();
}

renderMessages();

function onEnterPress() {
    if (messages.length % 2 != 0) {
        return;
    }
    const userInput = inputField.value;
    messages.push({"text": userInput});
    console.log("Enter key pressed!");
    inputField.value = "";

    // Render messages after adding a new one
    renderMessages();

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    messages
                ]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let message = data["candidates"][0]["content"]["parts"][0]["text"]; // Replace new lines with <br>
        console.log(message);
        messages.push({'text': `${message}`});
        
        // Render messages again to include the bot's response
        renderMessages();
    })
    .catch(err => console.log(err));
}

inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!event.shiftKey) { // Check if Shift is NOT pressed
            event.preventDefault(); // Prevent new line
            if (inputField.value !== "") {
                onEnterPress();
            }
        }
    }
});