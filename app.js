// SabAI Shared Logic & State Management

// Initial State
const DEFAULT_STATE = {
    businessInfo: {
        name: "SabAI Demo Store",
        services: "We provide automated AI solutions for social media engagement and customer support.",
        hours: "Monday to Friday, 9 AM - 6 PM",
        location: "123 Innovation Drive, Silicon Valley, CA",
        faqs: "Q: Do you offer a free trial? A: Yes, we have a 14-day free trial.\nQ: Which platforms do you support? A: We support Instagram, Facebook, and Website Chat.",
        tone: "Friendly"
    },
    automation: {
        instagram: true,
        facebook: false
    },
    history: [
        { date: "2024-05-03 10:15", customer: "Hi, what are your opening hours?", reply: "Hi there! Our opening hours are Monday to Friday, 9 AM - 6 PM. Let me know if you need anything else!", platform: "Website" },
        { date: "2024-05-03 11:20", customer: "Do you have a free trial?", reply: "Yes! We offer a 14-day free trial so you can test all our features.", platform: "Instagram" }
    ],
    stats: {
        totalConversations: 128,
        repliesSent: 342,
        instagramReplies: 156,
        facebookReplies: 84
    }
};

// State Accessors
function getState() {
    const saved = localStorage.getItem('sabai_state');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
}

function saveState(newState) {
    localStorage.setItem('sabai_state', JSON.stringify(newState));
}

// Authentication
function checkAuth() {
    if (localStorage.getItem('sabai_auth') !== 'true') {
        window.location.href = 'login.html';
    }
}

function login(email, password) {
    if (email === 'admin@sabai.com' && password === 'sabai2024') {
        localStorage.setItem('sabai_auth', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('sabai_auth');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sabai_user');
    window.location.href = 'login.html';
}

// Mock AI Logic
async function getAIResponse(userMessage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const state = getState();
    const info = state.businessInfo;
    const msg = userMessage.toLowerCase();

    // SIMPLE RAG MOCK
    // REPLACE WITH REAL CLAUDE API KEY HERE
    
    let response = "";

    if (msg.includes("hours") || msg.includes("open")) {
        response = `We are open ${info.hours}.`;
    } else if (msg.includes("location") || msg.includes("where")) {
        response = `You can find us at ${info.location}.`;
    } else if (msg.includes("service") || msg.includes("what do you do")) {
        response = info.services;
    } else if (msg.includes("trial") || msg.includes("free")) {
        response = "Yes! We offer a 14-day free trial for new users.";
    } else {
        // Fallback response as requested
        response = "I want to make sure I give you accurate information. Please call us or visit us directly.";
    }

    // Wrap in a friendly intro if it's the first message or matches "hi"
    if (msg.includes("hi") || msg.includes("hello")) {
        response = `Hi there! Thanks for reaching out. I am SabAI, your smart assistant. I am here to help you with any questions about our business. ${response}`;
    }

    // Add to history
    const newEntry = {
        date: new Date().toLocaleString(),
        customer: userMessage,
        reply: response,
        platform: "Website"
    };
    
    const newState = {...state};
    newState.history.unshift(newEntry);
    newState.stats.repliesSent += 1;
    newState.stats.totalConversations += 1;
    saveState(newState);

    return response;
}

// Webhook Mock Function (called from UI for demo purposes)
async function triggerWebhook(data) {
    console.log("Webhook triggered with:", data);
    return { status: "success", message: "This is a mock webhook response. Replace with real Claude API later." };
}

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Setup Chat Widget if it exists on page
    const trigger = document.getElementById('chat-widget-trigger');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-msg');
    const inputEl = document.getElementById('chat-input');
    const bodyEl = document.getElementById('chat-body');

    if (trigger) {
        trigger.onclick = () => {
            windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => windowEl.style.display = 'none';
    }

    if (sendBtn) {
        const handleSend = async () => {
            const text = inputEl.value.trim();
            if (!text) return;

            // User msg
            appendMsg(text, 'user');
            inputEl.value = '';

            // Typing
            const typing = showTyping();
            
            // Bot msg
            const response = await getAIResponse(text);
            typing.remove();
            appendMsg(response, 'bot');
        };

        sendBtn.onclick = handleSend;
        inputEl.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
    }

    function appendMsg(text, sender) {
        const div = document.createElement('div');
        div.className = `msg msg-${sender}`;
        div.innerText = text;
        bodyEl.appendChild(div);
        bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        bodyEl.appendChild(div);
        bodyEl.scrollTop = bodyEl.scrollHeight;
        return div;
    }
});
