import { showToast } from './cart.js';


const initAuthParticles = () => {
    if (!document.querySelector('.auth-container') || document.getElementById('site-dust-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'site-dust-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const particles = Array.from({ length: 95 }, () => ({
        x: 0,
        y: 0,
        r: 1 + Math.random() * 3,
        alpha: 0.18 + Math.random() * 0.34,
        speed: 0.12 + Math.random() * 0.35,
        drift: -0.12 + Math.random() * 0.24,
    }));
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles.forEach(p => { p.x = Math.random() * width; p.y = Math.random() * height; });
    };
    window.addEventListener('resize', resize);
    resize();
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.drift;
            p.y -= p.speed;
            if (p.y < -20) p.y = height + 20;
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 209, 102, ${p.alpha})`;
            ctx.shadowColor = 'rgba(255, 209, 102, 0.38)';
            ctx.shadowBlur = 8;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
};

// Auth state management
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('bookly_currentUser'));
};

export const logoutUser = () => {
    localStorage.removeItem('bookly_currentUser');
    localStorage.removeItem('bookly_cart');
    localStorage.removeItem('bookly_wishlist');
    localStorage.removeItem('bookly_cart_guest');
    localStorage.removeItem('bookly_wishlist_guest');
    window.location.href = 'index.html';
};

document.addEventListener('DOMContentLoaded', () => {
    initAuthParticles();
    // Check if we are on the login page
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        // Tab switching logic
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                // Add active to clicked
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });

        // Registration logic
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const phone = document.getElementById('register-phone')?.value.trim() || '';
            const password = document.getElementById('register-password').value;

            let users = JSON.parse(localStorage.getItem('bookly_users')) || [];
            
            // Check if username already exists
            if (users.some(u => String(u.username || '').toLowerCase() === username.toLowerCase())) {
                showToast('Tên đăng nhập này đã tồn tại, vui lòng dùng tên khác!', 'error');
                return;
            }

            // Check if email already exists
            if (users.some(u => String(u.email).toLowerCase() === email)) {
                showToast('Email này đã tồn tại, vui lòng dùng email khác!', 'error');
                return;
            }

            // Check phone format and existence
            if (phone) {
                const phoneRegex = /^0[0-9]{9,10}$/;
                if (!phoneRegex.test(phone)) {
                    showToast('Vui lòng nhập số điện thoại 10 hoặc 11 chữ số bắt đầu bằng số 0!', 'error');
                    return;
                }
                if (users.some(u => String(u.phone || '').trim() === phone)) {
                    showToast('Số điện thoại này đã tồn tại, vui lòng dùng số khác!', 'error');
                    return;
                }
            }

            const newUser = { id: Date.now(), name, username, email, phone, password };
            users.push(newUser);
            localStorage.setItem('bookly_users', JSON.stringify(users));

            // Auto login after register
            localStorage.setItem('bookly_currentUser', JSON.stringify({ id: newUser.id, name: newUser.name, username: newUser.username, email: newUser.email }));
            showToast('Đăng ký thành công!', 'success');
            
            setTimeout(() => {
                redirectAfterLogin();
            }, 1000);
        });

        // Login logic
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const account = document.getElementById('login-account').value.trim();
            const password = document.getElementById('login-password').value;

            let users = JSON.parse(localStorage.getItem('bookly_users')) || [];
            const user = users.find(u => String(u.username || '') === account && String(u.password || '') === password);

            if (user) {
                localStorage.setItem('bookly_currentUser', JSON.stringify({ id: user.id, name: user.name, username: user.username, email: user.email }));
                localStorage.removeItem('bookly_cart');
                localStorage.removeItem('bookly_wishlist');
                showToast('Đăng nhập thành công!', 'success');
                setTimeout(() => {
                    redirectAfterLogin();
                }, 1000);
            } else {
                showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
            }
        });


        const forgotBtn = document.querySelector('.forgot-password-btn');
        if (forgotBtn) {
            forgotBtn.addEventListener('click', () => {
                showToast('Mật khẩu mới đã được gửi về Gmail', 'info');
            });
        }

        document.querySelectorAll('.password-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.target);
                if (!input) return;
                const isHidden = input.type === 'password';
                input.type = isHidden ? 'text' : 'password';
                btn.innerHTML = isHidden ? '<i class="ph ph-eye-slash"></i>' : '<i class="ph ph-eye"></i>';
                btn.setAttribute('aria-label', isHidden ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
            });
        });
    }
});

function redirectAfterLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
        window.location.href = redirect;
    } else {
        window.location.href = 'index.html';
    }
}
