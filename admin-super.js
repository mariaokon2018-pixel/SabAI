// ============================================
// SUPER ADMIN JS — All interactive logic
// ============================================

// ---- MOCK DATA ----
var saClients = [
    { id: 1, name: 'Glow Beauty', email: 'glow@beauty.com', type: 'Salon', status: 'Active', convToday: 42, joined: 'Jan 15, 2024', plan: 'Pro', amount: 49, payStatus: 'Paid', nextPay: 'Jun 15, 2024', kb: 'We offer skincare treatments, hair styling, nail art, and beauty consultations. Open Mon-Sat 9am-7pm.' },
    { id: 2, name: 'Fresh Cuts Barbershop', email: 'info@freshcuts.com', type: 'Barbershop', status: 'Active', convToday: 18, joined: 'Feb 10, 2024', plan: 'Pro', amount: 49, payStatus: 'Paid', nextPay: 'Jun 10, 2024', kb: 'Men haircuts, beard trims, hot towel shaves. Walk-ins welcome. Open 7 days 8am-8pm.' },
    { id: 3, name: 'FitLife Gym', email: 'hello@fitlife.com', type: 'Fitness', status: 'Active', convToday: 85, joined: 'Mar 05, 2024', plan: 'Enterprise', amount: 99, payStatus: 'Paid', nextPay: 'Jun 05, 2024', kb: 'Full gym, personal training, yoga classes, juice bar. 24/7 access for members.' },
    { id: 4, name: 'Sparkle Clean', email: 'jobs@sparkleclean.com', type: 'Cleaning', status: 'Inactive', convToday: 0, joined: 'Jan 20, 2024', plan: 'Starter', amount: 19, payStatus: 'Overdue', nextPay: 'May 20, 2024', kb: 'Home and office cleaning services. Deep cleaning, move-in/out cleaning.' },
    { id: 5, name: 'Pet Palace', email: 'woof@petpalace.com', type: 'Pet Care', status: 'Active', convToday: 28, joined: 'Apr 12, 2024', plan: 'Pro', amount: 49, payStatus: 'Trial', nextPay: 'Jun 12, 2024', kb: 'Pet grooming, boarding, daycare, and vet referrals. We love your pets like our own!' }
];

var saConversations = [
    { biz: 'Glow Beauty', platform: 'ig', platLabel: 'Instagram', msg: 'How much is a facial treatment?', reply: 'Our facial treatments start at $45. Would you like to book?', date: 'Today, 11:30 AM', status: 'Resolved' },
    { biz: 'Fresh Cuts', platform: 'fb', platLabel: 'Facebook', msg: 'Are walk-ins available today?', reply: 'Yes! We have availability right now. Come on in!', date: 'Today, 11:15 AM', status: 'Resolved' },
    { biz: 'FitLife Gym', platform: 'web', platLabel: 'Website', msg: 'What are your membership prices?', reply: 'Monthly plans start at $29/mo. We also have annual discounts!', date: 'Today, 10:45 AM', status: 'Resolved' },
    { biz: 'Pet Palace', platform: 'ig', platLabel: 'Instagram', msg: 'Do you board cats too?', reply: 'Absolutely! We have separate cat boarding suites. $25/night.', date: 'Today, 10:20 AM', status: 'Resolved' },
    { biz: 'Glow Beauty', platform: 'web', platLabel: 'Website', msg: 'Can I reschedule my appointment?', reply: 'Of course! Please provide your booking reference and preferred date.', date: 'Today, 09:50 AM', status: 'Pending' },
    { biz: 'FitLife Gym', platform: 'fb', platLabel: 'Facebook', msg: 'Do you have a pool?', reply: 'Yes, we have a 25m heated pool open 6am-10pm daily.', date: 'Today, 09:30 AM', status: 'Resolved' },
    { biz: 'Fresh Cuts', platform: 'ig', platLabel: 'Instagram', msg: 'Love the new styles! 🔥', reply: 'Thank you! Book your next cut through our link in bio!', date: 'Yesterday, 4:20 PM', status: 'Resolved' },
    { biz: 'Pet Palace', platform: 'web', platLabel: 'Website', msg: 'What vaccines do you require?', reply: 'We require up-to-date rabies and distemper vaccines for all guests.', date: 'Yesterday, 3:10 PM', status: 'Resolved' },
    { biz: 'Sparkle Clean', platform: 'fb', platLabel: 'Facebook', msg: 'Can you clean my office this weekend?', reply: 'We offer weekend office cleaning! Let me get you a quote.', date: 'Yesterday, 1:45 PM', status: 'Pending' },
    { biz: 'Glow Beauty', platform: 'ig', platLabel: 'Instagram', msg: 'Do you use organic products?', reply: 'Yes! All our skincare products are 100% organic and cruelty-free.', date: 'Yesterday, 11:00 AM', status: 'Resolved' }
];

var saNotifications = [
    { icon: 'user-plus', iconClass: 'icon-green', title: 'New Business Signed Up', desc: 'Gloria Salon just created their SabAI account.', time: '2 hours ago', unread: true },
    { icon: 'alert-triangle', iconClass: 'icon-orange', title: 'Inactive Business Alert', desc: 'Tony Restaurant has not logged in for 30 days.', time: '1 day ago', unread: true },
    { icon: 'cpu', iconClass: 'icon-blue', title: 'API Usage Warning', desc: 'Claude API usage has reached 80% of monthly limit.', time: '2 days ago', unread: true },
    { icon: 'credit-card', iconClass: 'icon-red', title: 'Payment Overdue', desc: 'Payment overdue for Mike Gym — $49 past due.', time: '3 days ago', unread: false },
    { icon: 'user-plus', iconClass: 'icon-green', title: 'New Business Signed Up', desc: 'Fashion Hub just created their SabAI account.', time: '5 days ago', unread: false }
];

// ---- RENDER FUNCTIONS ----

function renderClientTable() {
    var tbody = document.getElementById('sa-clients-tbody');
    if (!tbody) return;
    tbody.innerHTML = saClients.map(function(c) {
        var statusClass = c.status === 'Active' ? 'badge-active' : 'badge-inactive';
        return '<tr id="client-row-' + c.id + '">' +
            '<td><strong>' + c.name + '</strong></td>' +
            '<td>' + c.email + '</td>' +
            '<td>' + c.type + '</td>' +
            '<td><span class="badge ' + statusClass + '" id="client-status-' + c.id + '">' + c.status + '</span></td>' +
            '<td>' + c.convToday + '</td>' +
            '<td>' + c.joined + '</td>' +
            '<td>' +
                '<button class="btn-action btn-view" onclick="showClientPanel(' + c.id + ')">View Details</button>' +
                '<button class="btn-action btn-deactivate" onclick="toggleClientStatus(' + c.id + ')" id="deact-btn-' + c.id + '">' + (c.status === 'Active' ? 'Deactivate' : 'Activate') + '</button>' +
                '<button class="btn-action btn-delete" onclick="showDeleteModal(' + c.id + ')">Delete</button>' +
            '</td></tr>';
    }).join('');
}

function showClientPanel(id) {
    var c = saClients.find(function(x) { return x.id === id; });
    if (!c) return;
    document.getElementById('panel-biz-name').textContent = c.name;
    document.getElementById('panel-email').textContent = c.email;
    document.getElementById('panel-type').textContent = c.type;
    document.getElementById('panel-status').textContent = c.status;
    document.getElementById('panel-joined').textContent = c.joined;
    document.getElementById('panel-plan').textContent = c.plan;
    document.getElementById('panel-conv').textContent = c.convToday;
    document.getElementById('panel-kb').textContent = c.kb;
    document.getElementById('side-panel').classList.add('open');
    document.getElementById('side-panel-overlay').style.display = 'block';
}

function closeSidePanel() {
    document.getElementById('side-panel').classList.remove('open');
    document.getElementById('side-panel-overlay').style.display = 'none';
}

function toggleClientStatus(id) {
    var c = saClients.find(function(x) { return x.id === id; });
    if (!c) return;
    c.status = c.status === 'Active' ? 'Inactive' : 'Active';
    renderClientTable();
}

var deleteTargetId = null;
function showDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('confirm-modal').classList.add('show');
}
function hideDeleteModal() {
    document.getElementById('confirm-modal').classList.remove('show');
    deleteTargetId = null;
}
function confirmDelete() {
    if (deleteTargetId !== null) {
        saClients = saClients.filter(function(c) { return c.id !== deleteTargetId; });
        renderClientTable();
    }
    hideDeleteModal();
}

// ---- CONVERSATIONS ----
function renderConversations(filtered) {
    var data = filtered || saConversations;
    var tbody = document.getElementById('sa-conv-tbody');
    if (!tbody) return;
    tbody.innerHTML = data.map(function(c) {
        var statusClass = c.status === 'Resolved' ? 'badge-resolved' : 'badge-pending';
        return '<tr>' +
            '<td><strong>' + c.biz + '</strong></td>' +
            '<td><span class="platform-icon ' + c.platform + '"><i data-lucide="' + (c.platform === 'ig' ? 'instagram' : c.platform === 'fb' ? 'facebook' : 'globe') + '" size="14"></i> ' + c.platLabel + '</span></td>' +
            '<td style="max-width:200px;">' + c.msg + '</td>' +
            '<td style="max-width:200px; color:#a855f7;">' + c.reply + '</td>' +
            '<td style="white-space:nowrap;">' + c.date + '</td>' +
            '<td><span class="badge ' + statusClass + '">' + c.status + '</span></td>' +
            '</tr>';
    }).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterConversations() {
    var bizFilter = document.getElementById('filter-biz').value;
    var platFilter = document.getElementById('filter-platform').value;
    var filtered = saConversations.filter(function(c) {
        var matchBiz = !bizFilter || c.biz === bizFilter;
        var matchPlat = !platFilter || c.platform === platFilter;
        return matchBiz && matchPlat;
    });
    renderConversations(filtered);
}

// ---- BILLING ----
function renderBilling() {
    var tbody = document.getElementById('sa-billing-tbody');
    if (!tbody) return;
    tbody.innerHTML = saClients.map(function(c) {
        var cls = c.payStatus === 'Paid' ? 'badge-paid' : c.payStatus === 'Trial' ? 'badge-trial' : 'badge-overdue';
        return '<tr>' +
            '<td><strong>' + c.name + '</strong></td>' +
            '<td>' + c.plan + '</td>' +
            '<td>$' + c.amount + '/mo</td>' +
            '<td><span class="badge ' + cls + '">' + c.payStatus + '</span></td>' +
            '<td>' + c.nextPay + '</td></tr>';
    }).join('');
}

// ---- NOTIFICATIONS ----
function renderNotifications() {
    var container = document.getElementById('sa-notif-list');
    if (!container) return;
    container.innerHTML = saNotifications.map(function(n, i) {
        return '<div class="notif-card ' + (n.unread ? 'unread' : '') + '" id="notif-' + i + '">' +
            (n.unread ? '<div class="notif-dot"></div>' : '') +
            '<div class="notif-icon ' + n.iconClass + '"><i data-lucide="' + n.icon + '"></i></div>' +
            '<div class="notif-body">' +
                '<h4>' + n.title + '</h4>' +
                '<p>' + n.desc + '</p>' +
                '<span class="notif-time">' + n.time + '</span>' +
            '</div></div>';
    }).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function markAllRead() {
    saNotifications.forEach(function(n) { n.unread = false; });
    renderNotifications();
}

// ---- ANALYTICS CHARTS ----
function initCharts() {
    // Chart 1: Conversations per day (line)
    var ctx1 = document.getElementById('chart-conv-daily');
    if (!ctx1) return;
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Conversations', data: [180, 220, 195, 310, 280, 340, 290], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#a855f7' }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: 'rgba(255,255,255,0.6)' } } }, scales: { x: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });

    // Chart 2: Top businesses (bar)
    new Chart(document.getElementById('chart-top-biz'), {
        type: 'bar',
        data: {
            labels: ['FitLife Gym', 'Glow Beauty', 'Pet Palace', 'Fresh Cuts', 'Sparkle Clean'],
            datasets: [{ label: 'Conversations', data: [85, 42, 28, 18, 5], backgroundColor: ['#a855f7', '#ec4899', '#3b82f6', '#22c55e', '#f97316'] }]
        },
        options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { display: false } } } }
    });

    // Chart 3: Platform breakdown (doughnut)
    new Chart(document.getElementById('chart-platforms'), {
        type: 'doughnut',
        data: {
            labels: ['Website (40%)', 'Instagram (35%)', 'Facebook (25%)'],
            datasets: [{ data: [40, 35, 25], backgroundColor: ['#a855f7', '#ec4899', '#3b82f6'], borderWidth: 0 }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: 'rgba(255,255,255,0.6)', padding: 16 } } } }
    });

    // Chart 4: Peak hours (bar)
    new Chart(document.getElementById('chart-peak'), {
        type: 'bar',
        data: {
            labels: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
            datasets: [{ label: 'Messages', data: [12, 28, 45, 62, 38, 30, 35, 48, 55, 40, 25, 15], backgroundColor: 'rgba(168,85,247,0.6)', borderRadius: 4 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { display: false } }, y: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
}

// ---- INIT ----
function initSuperAdmin() {
    renderClientTable();
    renderConversations();
    renderBilling();
    renderNotifications();
    initCharts();
}
