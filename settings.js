
        // Global badge state manager
        const BadgeManager = {
            STORAGE_KEY: 'notificationBadgeDismissed',
            isDismissed() {
                return localStorage.getItem(this.STORAGE_KEY) === 'true';
            },
            dismiss() {
                localStorage.setItem(this.STORAGE_KEY, 'true');
                this.hideAllBadges();
            },
            restore() {
                localStorage.removeItem(this.STORAGE_KEY);
            },
            hideAllBadges() {
                const badges = document.querySelectorAll('#notificationBadge');
                badges.forEach(badge => badge.style.display = 'none');
            },
            showBadgeIfNotDismissed(badge, count) {
                if (!this.isDismissed() && count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        };

        // Check badge state on page load
        window.addEventListener('load', () => {
            if (BadgeManager.isDismissed()) {
                BadgeManager.hideAllBadges();
            }
        });

        // Theme System - Inlined for all pages
        const THEMES = {
            default: {
                name: 'Default',
                '--primary-color': '#5170ff',
                '--primary-light': '#4162ff',
                '--bg-primary': '#000000',
                '--bg-secondary': '#0a0a0a',
                '--bg-tertiary': '#1a1a1a',
                '--accent-gradient-1': '#ffffff',
                '--accent-gradient-2': '#2630b6',
                '--glow-color-1': 'rgba(81, 112, 255, 0.4)',
                '--glow-color-2': 'rgba(81, 112, 255, 0.35)',
            },
            dark: {
                name: 'Dark',
                '--primary-color': '#888888',
                '--primary-light': '#666666',
                '--bg-primary': '#0b0b0b',
                '--bg-secondary': '#000000',
                '--bg-tertiary': '#2b2b2b',
                '--accent-gradient-1': '#0b0b0b',
                '--accent-gradient-2': '#2b2b2b',
                '--glow-color-1': 'rgba(100, 100, 100, 0.2)',
                '--glow-color-2': 'rgba(100, 100, 100, 0.1)',
            },
            light: {
                name: 'Light',
                '--primary-color': '#2630b6',
                '--primary-light': '#1e24a0',
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f5f5f5',
                '--bg-tertiary': '#e0e0e0',
                '--accent-gradient-1': '#ffffff',
                '--accent-gradient-2': '#f0f0f0',
                '--glow-color-1': 'rgba(38, 48, 182, 0.2)',
                '--glow-color-2': 'rgba(38, 48, 182, 0.1)',
            },
            sunset: {
                name: 'Sunset',
                '--primary-color': '#ffb86b',
                '--primary-light': '#ff9f43',
                '--bg-primary': '#1a0f0a',
                '--bg-secondary': '#0f0805',
                '--bg-tertiary': '#2b1810',
                '--accent-gradient-1': '#ffb86b',
                '--accent-gradient-2': '#7e4bb8',
                '--glow-color-1': 'rgba(255, 184, 107, 0.3)',
                '--glow-color-2': 'rgba(126, 75, 184, 0.2)',
            },
            obsidian: {
                name: 'Obsidian',
                '--primary-color': '#9b59b6',
                '--primary-light': '#8e44ad',
                '--bg-primary': '#0b0b0b',
                '--bg-secondary': '#050505',
                '--bg-tertiary': '#1a1a1a',
                '--accent-gradient-1': '#0b0b0b',
                '--accent-gradient-2': '#4d4d4d',
                '--glow-color-1': 'rgba(155, 89, 182, 0.3)',
                '--glow-color-2': 'rgba(155, 89, 182, 0.15)',
            },
            saphire: {
                name: 'Sapphire',
                '--primary-color': '#00b0ff',
                '--primary-light': '#0b3cff',
                '--bg-primary': '#0a1628',
                '--bg-secondary': '#050d15',
                '--bg-tertiary': '#0f1f33',
                '--accent-gradient-1': '#00b0ff',
                '--accent-gradient-2': '#0b3cff',
                '--glow-color-1': 'rgba(0, 176, 255, 0.3)',
                '--glow-color-2': 'rgba(11, 60, 255, 0.25)',
            },
            parrot: {
                name: 'Parrot',
                '--primary-color': '#69f0ae',
                '--primary-light': '#00bcd4',
                '--bg-primary': '#0a1515',
                '--bg-secondary': '#050a0a',
                '--bg-tertiary': '#0f1f1f',
                '--accent-gradient-1': '#69f0ae',
                '--accent-gradient-2': '#00bcd4',
                '--glow-color-1': 'rgba(105, 240, 174, 0.3)',
                '--glow-color-2': 'rgba(0, 188, 212, 0.25)',
            },
            icicle: {
                name: 'Icicle',
                '--primary-color': '#8ec5ff',
                '--primary-light': '#5ba3ff',
                '--bg-primary': '#0a1420',
                '--bg-secondary': '#050a10',
                '--bg-tertiary': '#0f1828',
                '--accent-gradient-1': '#e0f7fa',
                '--accent-gradient-2': '#8ec5ff',
                '--glow-color-1': 'rgba(142, 197, 255, 0.3)',
                '--glow-color-2': 'rgba(91, 163, 255, 0.2)',
            },
            lime: {
                name: 'Lime',
                '--primary-color': '#b0ff6d',
                '--primary-light': '#7be35a',
                '--bg-primary': '#0f1505',
                '--bg-secondary': '#080a03',
                '--bg-tertiary': '#1a2210',
                '--accent-gradient-1': '#b0ff6d',
                '--accent-gradient-2': '#7be35a',
                '--glow-color-1': 'rgba(176, 255, 109, 0.3)',
                '--glow-color-2': 'rgba(123, 227, 90, 0.2)',
            },
        };

        function applyTheme(themeName) {
            const theme = THEMES[themeName] || THEMES['default'];
            const root = document.documentElement;
            
            Object.entries(theme).forEach(([key, value]) => {
                if (key !== 'name') {
                    root.style.setProperty(key, value);
                }
            });

            if (themeName === 'light') {
                root.style.setProperty('--text-primary', '#000000');
                root.style.setProperty('--text-secondary', '#333333');
                root.style.setProperty('--border-color', '#cccccc');
            } else {
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#aaaaaa');
                root.style.setProperty('--border-color', '#333333');
            }
        }

        function loadSavedTheme() {
            const savedTheme = localStorage.getItem('site_theme') || 'default';
            applyTheme(savedTheme);
        }

        // Load theme immediately
        loadSavedTheme();

        const DISCORD_API = "https://discord.com/api/users/@me";
        const DISCORD_CLIENT_ID = "1436123870158520411";
        const REDIRECT_URI = 'https://status-bot.xyz/settings';
        const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify`;
        const AUTHORIZED_DEVS = ["1362553254117904496"];

        let currentUserId = null;

        function getAccessTokenFromHash() {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            return params.get('access_token');
        }

        function getToken() {
            let token = localStorage.getItem('discordToken');
            if (!token) {
                token = getAccessTokenFromHash();
                if (token) localStorage.setItem('discordToken', token);
            }
            return token;
        }

        async function fetchDiscordUser(token) {
            const response = await fetch(DISCORD_API, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok ? response.json() : null;
        }

        async function initProfile() {
            const token = getToken();
            if (!token) {
                document.getElementById('loginBtn').style.display = 'flex';
                document.getElementById('userBtnWrapper').style.display = 'none';
                document.getElementById('notificationBell').style.display = 'none';
                document.getElementById('loginBtn').onclick = () => window.location.href = OAUTH_URL;
                return;
            }

            const user = await fetchDiscordUser(token);
            if (user) {
                currentUserId = user.id;
                document.getElementById('loginBtn').style.display = 'none';
                document.getElementById('userBtnWrapper').style.display = 'flex';
                document.getElementById('notificationBell').style.display = 'flex';
                document.getElementById('userName').innerText = user.username;
                document.getElementById('userAvatar').style.backgroundImage = user.avatar 
                    ? `url('https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png')`
                    : `url('https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png')`;

                if (AUTHORIZED_DEVS.includes(user.id)) {
                    document.getElementById('devMenuItem').style.display = 'flex';
                }

                // Load notifications on profile init
                loadNotifications();
            } else {
                localStorage.removeItem('discordToken');
                initProfile();
            }
        }

        document.getElementById('userBtn').addEventListener('click', () => {
            const menu = document.getElementById('dropdownMenu');
            menu.classList.toggle('show');
            document.getElementById('userBtn').classList.toggle('active');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('discordToken');
            window.location.href = '/';
        });

        // Load theme on page load
        loadSavedTheme();

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const nav = document.querySelector('nav');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('show');
        });

        // Sidebar navigation
        document.querySelectorAll('.config-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                
                document.querySelectorAll('.config-nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                document.querySelectorAll('.config-section').forEach(sec => sec.classList.remove('active'));
                const sectionEl = document.getElementById(`config${section}`);
                if (sectionEl) sectionEl.classList.add('active');
            });
        });

        // Theme switching
        const THEME_KEY = "site_theme";
        
        function updateActiveSwatch() {
            const savedTheme = localStorage.getItem(THEME_KEY) || 'default';
            document.querySelectorAll('.swatch').forEach(swatch => {
                const theme = swatch.getAttribute('data-theme');
                if (theme === savedTheme) {
                    swatch.classList.add('active');
                } else {
                    swatch.classList.remove('active');
                }
            });
        }
        
        document.querySelectorAll('.swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const theme = swatch.getAttribute('data-theme');
                localStorage.setItem(THEME_KEY, theme);
                applyTheme(theme);
                updateActiveSwatch();
            });
        });
        
        updateActiveSwatch();

        // ========== NOTIFICATIONS FUNCTIONALITY ==========
        
        const BACKEND_URL = 'https://status-bot-backend.onrender.com';
        const SECRET_KEY = 'status-bot-stats-secret-key';

        async function loadNotifications() {
            if (!currentUserId) return;

            try {
                const response = await fetch(`${BACKEND_URL}/api/user/${currentUserId}/notifications`, {
                    headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                const notifications = data.notifications || [];

                const notificationsList = document.getElementById('notificationsList');
                const badge = document.getElementById('notificationBadge');

                if (notifications.length === 0) {
                    notificationsList.innerHTML = '<div style="text-align: center; padding: 30px 15px; color: #666; font-size: 13px;">No new notifications</div>';
                    badge.style.display = 'none';
                } else {
                    let unreadCount = 0;
                    let html = '';
                    
                    notifications.forEach(notif => {
                        if (!notif.read) unreadCount++;
                        const date = new Date(notif.createdAt);
                        const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        html += `
                            <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="markNotificationAsRead('${notif.id}')">
                                <div class="notification-title">${notif.title}</div>
                                <div class="notification-message">${notif.message}</div>
                                <div class="notification-time">${timeStr}</div>
                            </div>
                        `;
                    });

                    notificationsList.innerHTML = html;
                    
                    if (unreadCount > 0) {
                        badge.textContent = unreadCount;
                        if (!BadgeManager.isDismissed()) {
                            badge.style.display = 'flex';
                        }
                    } else {
                        badge.style.display = 'none';
                    }
                }
            } catch (err) {
                console.error('Error loading notifications:', err);
            }
        }

        async function markNotificationAsRead(notificationId) {
            if (!currentUserId) return;

            try {
                await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: currentUserId })
                });

                loadNotifications();
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }

        // Notification bell click handler
        const notificationBell = document.getElementById('notificationBell');
        const notificationPopup = document.getElementById('notificationPopup');
        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPopup.classList.toggle('show');
            // Dismiss badge globally across all pages
            BadgeManager.dismiss();
            if (notificationPopup.classList.contains('show')) {
                loadNotifications();
            }
        });

        // Close notification popup when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!notificationBell.contains(e.target) && !notificationPopup.contains(e.target)) {
                notificationPopup.classList.remove('show');
            }
        });

        // Reload notifications every 10 seconds
        setInterval(() => {
            if (currentUserId && notificationPopup.classList.contains('show')) {
                loadNotifications();
            }
        }, 10000);

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            const userBtn = document.getElementById('userBtn');
            const dropdown = document.getElementById('dropdownMenu');
            if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                userBtn.classList.remove('active');
            }
        });

        // ========== DEVELOPER PANEL & GIFTS FUNCTIONALITY ==========

        // Notification type selection
        let selectedNotificationType = 'Update';
        document.querySelectorAll('.notification-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.notification-type-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                });
                btn.classList.add('active');
                btn.style.background = 'rgba(81, 112, 255, 0.2)';
                btn.style.borderColor = '#5170ff';
                selectedNotificationType = btn.getAttribute('data-type');
            });
        });

        // Send Trial
        document.getElementById('sendTrialBtn').addEventListener('click', async () => {
            const sendToAll = document.getElementById('sendTrialToAll').checked;
            const userId = document.getElementById('trialUserId').value.trim();
            const duration = parseInt(document.getElementById('trialDuration').value) || 7;

            if (!sendToAll && !userId) {
                alert('Please enter a User ID or check "Send to all users"');
                return;
            }

            const btn = document.getElementById('sendTrialBtn');
            btn.disabled = true;
            btn.textContent = 'Sending...';

            try {
                const targetUsers = sendToAll ? [] : [userId];
                const response = await fetch(`${BACKEND_URL}/api/trials/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                        durationDays: duration,
                        targetUsers: targetUsers,
                        sendToAll: sendToAll
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(`✅ Trial sent to ${sendToAll ? 'all users' : 'user ' + userId}!`);
                    document.getElementById('trialUserId').value = '';
                    document.getElementById('trialDuration').value = '7';
                    document.getElementById('sendTrialToAll').checked = false;
                } else {
                    alert(`❌ ${data.error || 'Failed to send trial'}`);
                }
            } catch (err) {
                alert(`❌ Error: ${err.message}`);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Send Trial';
            }
        });

        // Send Notification
        document.getElementById('sendNotificationBtn').addEventListener('click', async () => {
            const title = document.getElementById('notificationTitle').value.trim();
            const message = document.getElementById('notificationMessage').value.trim();
            const sendToAll = document.getElementById('notificationToAll').checked;

            if (!title || !message) {
                alert('Please fill in both title and message');
                return;
            }

            const btn = document.getElementById('sendNotificationBtn');
            btn.disabled = true;
            btn.textContent = 'Sending...';

            try {
                const response = await fetch(`${BACKEND_URL}/api/notifications/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        message,
                        type: selectedNotificationType,
                        targetUsers: sendToAll ? [] : [],
                        sendToAll: sendToAll
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(`✅ Notification sent to ${sendToAll ? 'all users' : 'selected users'}!`);
                    document.getElementById('notificationTitle').value = '';
                    document.getElementById('notificationMessage').value = '';
                    document.getElementById('notificationToAll').checked = false;
                } else {
                    alert(`❌ ${data.error || 'Failed to send notification'}`);
                }
            } catch (err) {
                alert(`❌ Error: ${err.message}`);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Send Notification';
            }
        });

        // Load gifts for user
        async function loadGifts() {
            if (!currentUserId) return;

            try {
                // Add cache busting parameter to prevent stale data
                const timestamp = new Date().getTime();
                const response = await fetch(`${BACKEND_URL}/api/user/${currentUserId}/gifts?t=${timestamp}`, {
                    headers: { 
                        'Authorization': `Bearer ${SECRET_KEY}`
                    }
                });

                if (!response.ok) {
                    console.warn(`Gift loading returned status ${response.status}`);
                    document.getElementById('giftsList').innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No gifts available</div>';
                    return;
                }

                const data = await response.json();
                const gifts = data.gifts || [];

                if (gifts.length === 0) {
                    document.getElementById('giftsList').innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No gifts available</div>';
                    return;
                }

                let giftsHTML = '';
                gifts.forEach(gift => {
                    const claimDisabled = gift.claimed;
                    const expiresDate = new Date(gift.expiresAt).toLocaleDateString();
                    giftsHTML += `
                        <div class="gift-entry">
                            <div class="gift-icon-container">
                                <span style="font-size: 28px;">🎁</span>
                            </div>
                            <div class="gift-details">
                                <div class="gift-name">${gift.durationDays}-Day Premium Trial</div>
                                <div class="gift-code">Expires: <span>${expiresDate}</span></div>
                            </div>
                            ${claimDisabled ? 
                                '<div class="claimed">✓ Claimed</div>' : 
                                `<button class="claim-btn" onclick="claimGift('${gift.id}')">Claim</button>`
                            }
                        </div>
                    `;
                });

                document.getElementById('giftsList').innerHTML = giftsHTML;
            } catch (err) {
                console.error('Error loading gifts:', err);
                document.getElementById('giftsList').innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Error loading gifts</div>';
            }
        }

        // Claim gift function
        async function claimGift(giftId) {
            if (!currentUserId) {
                alert('You must be logged in');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/trials/claim`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                        trialId: giftId
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('✅ Gift claimed! Premium activated!');
                    loadGifts(); // Reload gifts
                } else {
                    alert(`❌ ${data.error || 'Failed to claim gift'}`);
                }
            } catch (err) {
                alert(`❌ Error: ${err.message}`);
            }
        }

        // Load gifts when gifts section is shown
        const giftsLink = document.querySelector('[data-section="gifts"]');
        if (giftsLink) {
            giftsLink.addEventListener('click', () => {
                setTimeout(loadGifts, 100);
            });
        }

        initProfile();
    