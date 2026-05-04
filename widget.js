// ============================================
// SabAI Chat Widget — Self-contained embed
// Loads on any external website via <script> tag
// ============================================
(function() {
    'use strict';

    // --- CONFIG ---
    var SERVER_URL = 'http://localhost:3000';

    // --- READ BUSINESS ID FROM SCRIPT TAG ---
    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];
    var scriptSrc = currentScript.getAttribute('src') || '';
    var businessId = '';
    var match = scriptSrc.match(/[?&]id=([^&]+)/);
    if (match) businessId = decodeURIComponent(match[1]);

    // --- INJECT STYLES ---
    var css = document.createElement('style');
    css.textContent = [
        '#sabai-widget-trigger{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);border:none;cursor:pointer;z-index:99999;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(168,85,247,0.4);transition:transform .2s,box-shadow .2s;}',
        '#sabai-widget-trigger:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(168,85,247,0.6);}',
        '#sabai-widget-trigger svg{width:28px;height:28px;fill:#fff;}',
        '#sabai-widget-badge{position:absolute;top:-2px;right:-2px;width:20px;height:20px;background:#ef4444;border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;border:2px solid #1a1a2e;}',
        '#sabai-chat-window{position:fixed;bottom:96px;right:24px;width:350px;height:500px;background:#1A1A2E;border-radius:16px;z-index:99999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 10px 50px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);font-family:"Inter",Arial,sans-serif;}',
        '#sabai-chat-window.open{display:flex;}',
        '#sabai-chat-header{background:linear-gradient(135deg,#a855f7,#ec4899);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
        '#sabai-chat-header-left{display:flex;align-items:center;gap:10px;}',
        '#sabai-chat-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;}',
        '#sabai-chat-avatar svg{width:20px;height:20px;fill:#fff;}',
        '#sabai-chat-title{color:#fff;font-size:15px;font-weight:700;}',
        '#sabai-chat-status{color:rgba(255,255,255,0.8);font-size:11px;display:flex;align-items:center;gap:5px;}',
        '#sabai-chat-status .dot{width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;}',
        '#sabai-chat-close{background:none;border:none;color:rgba(255,255,255,0.8);font-size:22px;cursor:pointer;padding:4px;line-height:1;}',
        '#sabai-chat-close:hover{color:#fff;}',
        '#sabai-chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}',
        '#sabai-chat-body::-webkit-scrollbar{width:4px;}',
        '#sabai-chat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}',
        '.sabai-msg{max-width:80%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-wrap:break-word;}',
        '.sabai-msg-bot{align-self:flex-start;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;border-bottom-left-radius:4px;}',
        '.sabai-msg-user{align-self:flex-end;background:#fff;color:#1a1a2e;border-bottom-right-radius:4px;}',
        '.sabai-typing{align-self:flex-start;display:flex;gap:5px;padding:12px 16px;background:rgba(255,255,255,0.06);border-radius:14px;border-bottom-left-radius:4px;}',
        '.sabai-typing .tdot{width:7px;height:7px;background:rgba(255,255,255,0.4);border-radius:50%;animation:sabai-bounce 1.4s infinite;}',
        '.sabai-typing .tdot:nth-child(2){animation-delay:0.2s;}',
        '.sabai-typing .tdot:nth-child(3){animation-delay:0.4s;}',
        '@keyframes sabai-bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}',
        '#sabai-chat-input-bar{display:flex;align-items:center;padding:12px;border-top:1px solid rgba(255,255,255,0.06);background:#141425;flex-shrink:0;}',
        '#sabai-chat-input{flex:1;background:rgba(255,255,255,0.06);border:none;padding:10px 14px;border-radius:10px;color:#fff;font-size:13px;font-family:"Inter",Arial,sans-serif;outline:none;}',
        '#sabai-chat-input::placeholder{color:rgba(255,255,255,0.3);}',
        '#sabai-chat-send{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#a855f7,#ec4899);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-left:8px;transition:opacity .2s;flex-shrink:0;}',
        '#sabai-chat-send:hover{opacity:0.85;}',
        '#sabai-chat-send svg{width:16px;height:16px;fill:#fff;}',
        '#sabai-chat-powered{text-align:center;padding:6px;font-size:10px;color:rgba(255,255,255,0.25);background:#141425;flex-shrink:0;}'
    ].join('\n');
    document.head.appendChild(css);

    // --- INJECT HTML ---
    var container = document.createElement('div');
    container.id = 'sabai-widget-container';
    container.innerHTML = [
        '<button id="sabai-widget-trigger">',
            '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>',
            '<span id="sabai-widget-badge">1</span>',
        '</button>',
        '<div id="sabai-chat-window">',
            '<div id="sabai-chat-header">',
                '<div id="sabai-chat-header-left">',
                    '<div id="sabai-chat-avatar"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>',
                    '<div>',
                        '<div id="sabai-chat-title">SabAI</div>',
                        '<div id="sabai-chat-status"><span class="dot"></span> Active Now</div>',
                    '</div>',
                '</div>',
                '<button id="sabai-chat-close">&times;</button>',
            '</div>',
            '<div id="sabai-chat-body">',
                '<div class="sabai-msg sabai-msg-bot">Hi there! 👋 How can I help you today?</div>',
            '</div>',
            '<div id="sabai-chat-input-bar">',
                '<input type="text" id="sabai-chat-input" placeholder="Type your message...">',
                '<button id="sabai-chat-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
            '</div>',
            '<div id="sabai-chat-powered">Powered by SabAI</div>',
        '</div>'
    ].join('');
    document.body.appendChild(container);

    // --- LOGIC ---
    var trigger = document.getElementById('sabai-widget-trigger');
    var chatWindow = document.getElementById('sabai-chat-window');
    var closeBtn = document.getElementById('sabai-chat-close');
    var sendBtn = document.getElementById('sabai-chat-send');
    var input = document.getElementById('sabai-chat-input');
    var body = document.getElementById('sabai-chat-body');
    var badge = document.getElementById('sabai-widget-badge');

    trigger.addEventListener('click', function() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            badge.style.display = 'none';
            input.focus();
        }
    });

    closeBtn.addEventListener('click', function() {
        chatWindow.classList.remove('open');
    });

    function addMsg(text, sender) {
        var div = document.createElement('div');
        div.className = 'sabai-msg sabai-msg-' + sender;
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'sabai-typing';
        div.id = 'sabai-typing-indicator';
        div.innerHTML = '<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>';
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        return div;
    }

    function removeTyping() {
        var el = document.getElementById('sabai-typing-indicator');
        if (el) el.remove();
    }

    async function sendMessage() {
        var text = input.value.trim();
        if (!text) return;

        addMsg(text, 'user');
        input.value = '';
        var typing = showTyping();

        try {
            var resp = await fetch(SERVER_URL + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    businessId: businessId
                })
            });
            var data = await resp.json();
            removeTyping();
            addMsg(data.reply || 'Sorry, I could not process that.', 'bot');
        } catch (err) {
            removeTyping();
            addMsg('Sorry, I am unable to connect right now. Please try again later.', 'bot');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

})();
