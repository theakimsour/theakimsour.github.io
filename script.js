/**
 * Cyber-Bento Portfolio Engine
 * - Interactive Typewriter Terminal
 * - ICMP Ping Simulator (Latency testing widget)
 * - Dynamic Theme Switcher (Dark/Light)
 * - Navigation Highlighter
 * - Form Validation
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Typewriter Simulation in Terminal
       ========================================================================== */
    const typedEl = document.getElementById('typed-output');
    const commands = [
        'ping -c 3 gateway.telecom.local',
        'cat /etc/protocols/routing.conf',
        'python3 -m unittest test_network.py',
        'traceroute 192.168.1.1'
    ];
    let cmdIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        const currentCmd = commands[cmdIdx];

        if (isDeleting) {
            typedEl.textContent = currentCmd.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedEl.textContent = currentCmd.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 30 : 70;

        if (!isDeleting && charIdx === currentCmd.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            cmdIdx = (cmdIdx + 1) % commands.length;
            typeSpeed = 400;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    if (typedEl) {
        typeLoop();
    }

    /* ==========================================================================
       2. Interactive ICMP Ping Simulator Widget
       ========================================================================== */
    const pingBtn = document.getElementById('run-ping-btn');
    const pingLog = document.getElementById('ping-output');

    if (pingBtn && pingLog) {
        pingBtn.addEventListener('click', () => {
            pingBtn.disabled = true;
            pingLog.innerHTML = '<span style="color: var(--text-accent);">TRANSMITTING ICMP ECHO_REQUEST TO GATEWAY...</span>';

            setTimeout(() => {
                const ms1 = Math.floor(Math.random() * 8) + 10;
                const ms2 = Math.floor(Math.random() * 6) + 11;
                const ms3 = Math.floor(Math.random() * 7) + 9;

                pingLog.innerHTML = `
          64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=${ms1}ms<br>
          64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=${ms2}ms<br>
          64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=${ms3}ms<br>
          <span style="color: var(--accent-green);">--- 3 packets transmitted, 3 received, 0% packet loss ---</span>
        `;
                pingBtn.disabled = false;
            }, 900);
        });
    }

    /* ==========================================================================
       3. Dark / Light Scheme Engine
       ========================================================================== */
    const themeBtn = document.getElementById('theme-btn');
    const htmlRoot = document.documentElement;

    function syncTheme(theme) {
        htmlRoot.setAttribute('data-theme', theme);
        localStorage.setItem('kimsour_cyber_theme', theme);
    }

    const storedTheme = localStorage.getItem('kimsour_cyber_theme') || 'dark';
    syncTheme(storedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const active = htmlRoot.getAttribute('data-theme');
            syncTheme(active === 'dark' ? 'light' : 'dark');
        });
    }

    /* ==========================================================================
       4. Mobile Navigation Drawer
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const cmdNav = document.getElementById('cmd-nav');

    if (mobileToggle && cmdNav) {
        mobileToggle.addEventListener('click', () => {
            cmdNav.classList.toggle('active');
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cmdNav.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       5. Scroll Spy Navigation Highlighting & Progress Bars
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-btn');
    const progressBars = document.querySelectorAll('.meter-bar .fill');
    let metricsAnimated = false;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;

        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            if (scrollPos >= secTop) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        const skillsSec = document.getElementById('skills');
        if (skillsSec && !metricsAnimated) {
            if (scrollPos >= skillsSec.offsetTop - 350) {
                progressBars.forEach(bar => {
                    const val = bar.style.getPropertyValue('--val');
                    bar.style.width = val;
                });
                metricsAnimated = true;
            }
        }
    }, { passive: true });

    /* ==========================================================================
       6. Terminal Form Validation
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const formLog = document.getElementById('form-log');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fname = document.getElementById('fname');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            let isValid = true;

            if (fname.value.trim().length < 2) {
                fname.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                fname.parentElement.classList.remove('has-error');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                email.parentElement.classList.remove('has-error');
            }

            if (message.value.trim().length < 10) {
                message.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                message.parentElement.classList.remove('has-error');
            }

            if (!isValid) {
                formLog.className = 'form-log-status error';
                formLog.textContent = '[ERR_PACKET_INVALID] Please resolve flagged input fields.';
                return;
            }

            const submitBtn = document.getElementById('form-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'TRANSMITTING_PAYLOAD...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'DISPATCH_MESSAGE';
                formLog.className = 'form-log-status success';
                formLog.textContent = '[ACK_RECEIVED] Transmission routed successfully. Thank you!';
                form.reset();

                setTimeout(() => {
                    formLog.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }

    // Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});