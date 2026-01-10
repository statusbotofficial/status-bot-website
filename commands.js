
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

        // Theme System
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

        // Theme switching
        const THEME_KEY = "site_theme";
        document.querySelectorAll('.swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const theme = swatch.getAttribute('data-theme');
                localStorage.setItem(THEME_KEY, theme);
                applyTheme(theme);
            });
        });

        const DISCORD_CLIENT_ID = '1436123870158520411';
        const REDIRECT_URI = 'https://status-bot.xyz/';
        const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify+guilds`;

        const loginBtn = document.getElementById('loginBtn');
        const userBtn = document.getElementById('userBtn');
        const userBtnWrapper = document.getElementById('userBtnWrapper');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        // Check if user is already logged in
        function checkLogin() {
            const storedUser = localStorage.getItem('discordUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                displayUser(user);
            }
        }

        // Display user info
        function displayUser(user) {
            userName.textContent = user.username;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`;
            userAvatar.style.backgroundImage = `url('${avatarUrl}')`;
            
            loginBtn.style.display = 'none';
            userBtnWrapper.style.display = 'block';
        }

        // Login button click
        loginBtn.addEventListener('click', () => {
            window.location.href = AUTH_URL;
        });

        // Toggle dropdown menu
        userBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
            userBtn.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userBtnWrapper.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                userBtn.classList.remove('active');
            }
        });

        // Logout button click
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('discordUser');
            localStorage.removeItem('discordToken');
            loginBtn.style.display = 'block';
            userBtnWrapper.style.display = 'none';
            dropdownMenu.classList.remove('show');
            location.reload();
        });

        // Get access token from URL hash
        function getAccessToken() {
            const hash = window.location.hash;
            if (!hash) return null;
            const params = new URLSearchParams(hash.substring(1));
            return params.get('access_token');
        }

        // Fetch user info using Discord token
        async function fetchDiscordUser(token) {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user');
            return response.json();
        }

        // Check for OAuth callback
        function handleCallback() {
            let token = getAccessToken();

            if (token) {
                localStorage.setItem('discordToken', token);
                window.history.replaceState({}, document.title, window.location.pathname);
                fetchAndDisplayUser(token);
            }
        }

        // Fetch and display user
        async function fetchAndDisplayUser(token) {
            try {
                const user = await fetchDiscordUser(token);
                localStorage.setItem('discordUser', JSON.stringify(user));
                displayUser(user);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('discordToken');
            }
        }

        // Initialize on page load
        window.addEventListener('load', () => {
            checkLogin();
            handleCallback();
            initNotifications();
        });

        // ========== NOTIFICATION BELL FUNCTIONALITY ==========
        const BACKEND_URL = 'https://status-bot-backend.onrender.com';
        const SECRET_KEY = 'status-bot-stats-secret-key';
        let currentUserId = null;

        function initNotifications() {
            const discordUserStr = localStorage.getItem('discordUser');
            if (discordUserStr) {
                const user = JSON.parse(discordUserStr);
                currentUserId = user.id;
                
                const notificationBell = document.getElementById('notificationBell');
                if (notificationBell) {
                    notificationBell.style.display = 'flex';
                }
                setupNotificationListeners();
                loadNotifications();
            }
        }

        async function loadNotifications() {
            if (!currentUserId) return;

            try {
                const response = await fetch(`${BACKEND_URL}/api/user/${currentUserId}/notifications`, {
                    headers: { 'Authorization': `Bearer ${SECRET_KEY}` }
                });

                if (!response.ok) return;

                const data = await response.json();
                const notifications = data.notifications || [];

                const notificationsList = document.getElementById('notificationsList');
                const badge = document.getElementById('notificationBadge');
                const notificationPopup = document.getElementById('notificationPopup');

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
                            <div class="notification-item" style="padding: 12px 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: background-color 0.2s; ${notif.read ? '' : 'background-color: rgba(81, 112, 255, 0.1);'}" onclick="markNotificationAsRead('${notif.id}')">
                                <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${notif.title}</div>
                                <div style="font-size: 12px; color: #aaa; margin-bottom: 6px;">${notif.message}</div>
                                <div style="font-size: 11px; color: #666;">${timeStr}</div>
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

        function setupNotificationListeners() {
            const notificationBell = document.getElementById('notificationBell');
            const notificationPopup = document.getElementById('notificationPopup');

            if (!notificationBell || !notificationPopup) return;

            notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = notificationPopup.style.display === 'flex';
                notificationPopup.style.display = isVisible ? 'none' : 'flex';
                // Dismiss badge globally across all pages
                BadgeManager.dismiss();
                if (!isVisible) {
                    loadNotifications();
                }
            });

            document.addEventListener('click', (e) => {
                if (!notificationBell.contains(e.target) && !notificationPopup.contains(e.target)) {
                    notificationPopup.style.display = 'none';
                }
            });

            setInterval(() => {
                if (currentUserId && notificationPopup.style.display === 'flex') {
                    loadNotifications();
                }
            }, 10000);
        }

        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.parentElement.classList.toggle('show');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.parentElement.classList.remove('show');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                hamburger.classList.remove('active');
                navMenu.parentElement.classList.remove('show');
            }
        });

        // Category button functionality
        const categoryButtons = document.querySelectorAll('.category-btn');
        const commandCards = document.querySelectorAll('.command-card');
        const searchBox = document.getElementById('searchBox');

        function filterCards() {
            const selectedCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
            const searchTerm = searchBox.value.toLowerCase();

            commandCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');
                const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                const cardDescription = card.querySelector('p').textContent.toLowerCase();
                
                const matchesCategory = cardCategories.includes(selectedCategory);
                const matchesSearch = cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm);
                
                if (matchesCategory && matchesSearch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterCards();
            });
        });

        searchBox.addEventListener('input', filterCards);
    