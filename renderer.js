var showdown  = require('showdown'),
converter = new showdown.Converter();

const inputField = document.getElementById('entry-box');
const API_KEY = "AIzaSyB-8_m7kiuNGgfNs_lns0ILwrrERfqfhjM";

let messages = [];

function renderMessages() {
    const AI_UI = document.getElementById('AI-UI');
    AI_UI.innerHTML = messages.map((message, i) => {
        return `<div class="message ${i % 2 === 0 ? 'user' : 'bot'}">${converter.makeHtml(message.text)}</div><br>`;
    }).join(''); // Join the array into a single string
}

messages.push({"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."});
messages.push({"text": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."});
messages.push({"text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."});
messages.push({"text": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."});
messages.push({"text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."});
messages.push({"text": "Once upon a time, in a land far away, there lived a curious dragon named Zephyr. 🐉"});
messages.push({"text": "Zephyr loved to explore the skies and often soared through the clouds."});
messages.push({"text": "One day, he discovered a hidden valley filled with sparkling crystals."});
messages.push({"text": "The valley was home to magical creatures who welcomed him with open arms."});
messages.push({"text": "Together, they embarked on adventures, uncovering the secrets of the valley."});
messages.push({"text": "In the end, Zephyr realized that friendship was the greatest treasure of all."});
messages.push({"text": "Praesent commodo cursus magna, vel scelerisque nisl consectetur et."});
messages.push({"text": "Curabitur blandit tempus porttitor."});
messages.push({"text": "Donec ullamcorper nulla non metus auctor fringilla."});
messages.push({"text": "Vestibulum id ligula porta felis euismod semper."});
messages.push({"text": "Aenean lacinia bibendum nulla sed consectetur."});
renderMessages();

function onEnterPress() {
    const userInput = inputField.value.replace(/\n/g, '<br>'); // Replace new lines with <br>
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
        let message = data["candidates"][0]["content"]["parts"][0]["text"].replace(/\n/g, '<br>'); // Replace new lines with <br>
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