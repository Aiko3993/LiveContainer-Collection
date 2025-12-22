
import { getState } from './state.js';
import { getIcon } from './utils.js';

let eggClickCount = 0;
let eggTimer = null;

export function showDeveloperConsolePrompt() {
    const searchInput = document.getElementById('search-input');
    // Prevent duplicate toasts
    const existingToast = document.getElementById('debug-prompt-toast');
    if (existingToast) existingToast.remove();

    // Show a toast or small prompt asking if they want to enter developer mode
    const toast = document.createElement('div');
    toast.id = 'debug-prompt-toast';
    // Position absolute relative to the search container, but centered and fixed width
    toast.className = `absolute top-full left-0 right-0 mx-auto mt-2 z-50 flex flex-col items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border border-green-500/30 backdrop-blur-xl animate-slide-up bg-black/90 text-green-400 font-mono w-max min-w-[280px]`;
    
    toast.innerHTML = `
        <div class="text-sm font-bold flex items-center gap-2">
            <span>> DETECTED_DEBUG_SEQUENCE</span>
            <span class="animate-pulse">_</span>
        </div>
        <div class="text-xs opacity-80">Initialize Developer Console?</div>
        <div class="flex gap-3 mt-2 w-full">
            <button id="dev-yes" class="flex-1 py-1.5 bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 rounded text-xs font-bold transition-colors">CONFIRM</button>
            <button id="dev-no" class="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded text-xs font-bold transition-colors text-red-400">ABORT</button>
        </div>
    `;
    
    // Append to the search input's parent container for correct positioning
    searchInput.parentElement.appendChild(toast);
    
    // Auto remove after 5s
    const timer = setTimeout(() => {
        if(document.body.contains(toast)) toast.remove();
    }, 5000);
    
    document.getElementById('dev-yes').onclick = () => {
        clearTimeout(timer);
        toast.remove();
        openDeveloperConsole();
    };
    
    document.getElementById('dev-no').onclick = () => {
        clearTimeout(timer);
        toast.remove();
    };
}

export function openDeveloperConsole() {
    const { currentSource } = getState();
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[9999] bg-black/95 text-green-500 font-mono p-4 flex flex-col animate-fade-in overflow-hidden';
    
    const effects = [
        'emoji-rain', 'matrix-rain', 'spin-madness',
        'ascii-tux', 'retro-terminal', 'warp-speed',
        'fireworks', 'retro-pong', 'element-eater'
    ];
    
    // Add ascii-waifu ONLY if in NSFW mode, and REMOVE ascii-tux
    if (currentSource === 'nsfw') {
        // Remove ascii-tux
        const tuxIndex = effects.indexOf('ascii-tux');
        if (tuxIndex > -1) effects.splice(tuxIndex, 1);
        
        // Add waifu (insert at same position or append)
        effects.splice(tuxIndex > -1 ? tuxIndex : effects.length, 0, 'ascii-waifu');
    }

    overlay.innerHTML = `
        <div class="flex justify-between items-center border-b border-green-500/30 pb-4 mb-4">
            <h2 class="text-xl font-bold flex items-center gap-2">
                <span>> DEV_CONSOLE</span>
                <span class="w-3 h-5 bg-green-500 animate-pulse inline-block"></span>
            </h2>
            <button id="dev-close" class="text-red-500 hover:text-red-400 font-bold">[EXIT]</button>
        </div>
        
        <div class="flex-grow overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${effects.map(effect => `
                    <button class="dev-effect-btn text-left p-4 border border-green-500/30 hover:bg-green-500/10 hover:border-green-500 rounded-lg transition-all group relative overflow-hidden" data-effect="${effect}">
                        <div class="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div class="relative z-10 font-bold text-sm uppercase tracking-wider mb-1">./run ${effect}</div>
                        <div class="relative z-10 text-[10px] opacity-60">Execute ${effect} sequence</div>
                    </button>
                `).join('')}
            </div>
            
            <div class="mt-8 border-t border-green-500/30 pt-4 text-xs opacity-50">
                <p>> SYSTEM STATUS: ONLINE</p>
                <p>> MEMORY: ${Math.round(performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0)}MB USED</p>
                <p>> USER_AGENT: ${navigator.userAgent}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Handlers
    document.getElementById('dev-close').onclick = () => overlay.remove();
    
    overlay.querySelectorAll('.dev-effect-btn').forEach(btn => {
        btn.onclick = () => {
            const effect = btn.dataset.effect;
            overlay.remove();
            if(effect === 'element-eater') {
                triggerElementEater();
            } else {
                triggerConfetti(effect);
            }
        };
    });
}

export function handleEasterEgg() {
    const { currentSource } = getState();
    const { isMobile } = window;
    clearTimeout(eggTimer);
    eggClickCount++;
    
    const pingDot = document.getElementById('status-dot-ping');
    const coreDot = document.getElementById('status-dot-core');
    const wrapper = document.getElementById('status-dot-wrapper');
    
    if (pingDot && coreDot && wrapper) {
        // Turn Red Immediately (Remove Green/Yellow)
        pingDot.classList.remove('bg-green-400', 'group-hover:bg-yellow-400');
        pingDot.classList.add('bg-red-500');
        
        coreDot.classList.remove('bg-green-500', 'group-hover:bg-yellow-500');
        coreDot.classList.add('bg-red-600');

        // Trigger limit (reduced for mobile)
        const limit = (typeof isMobile === 'function' && isMobile()) ? 5 : 10;

        // Trigger at limit
        if (eggClickCount >= limit) {
             let effects = [
                 'emoji-rain', 'matrix-rain', 'spin-madness',
                 'ascii-tux', 'retro-terminal', 'warp-speed', 'gravity', 'retro-pong'
             ];
             
             // Remove ascii-tux in NSFW mode
             if (currentSource === 'nsfw') {
                 effects = effects.filter(e => e !== 'ascii-tux');
             }

             const randomEffect = effects[Math.floor(Math.random() * effects.length)];
             
             // Chain: Element Eater (Intro) -> Random Effect
             triggerElementEater(() => {
                 triggerConfetti(randomEffect);
             });
             
             eggClickCount = -999;
             return;
        }

        // Reset timer (if no click for 1000ms, revert to green)
        eggTimer = setTimeout(resetEgg, 1000);
    }
}

export function triggerElementEater(callback) {
    const footer = document.querySelector('footer');
    const wrapper = document.getElementById('status-dot-wrapper');
    const pingDot = document.getElementById('status-dot-ping');
    
    if (!footer || !wrapper) {
        if(callback) callback();
        return;
    }

    // 1. Prepare for EATING
    // Stop ping animation to keep it solid red
    if (pingDot) pingDot.classList.remove('animate-ping');

    // 2. FOOTER TURNS RED & FADES (EATING EFFECT)
    // Instead of dot expanding, the infection spreads to the footer container
    setTimeout(() => {
        footer.style.transition = 'all 1s ease-in-out';
        
        const footerBg = footer.querySelector('div');
        if(footerBg) {
            footerBg.style.transition = 'all 1s ease-in-out';
            footerBg.style.backgroundColor = '#ef4444'; // Red-500
            footerBg.style.borderColor = '#b91c1c'; // Red-700
            footerBg.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.6)';
            
            // Text color change
            footerBg.querySelectorAll('*').forEach(el => {
                el.style.transition = 'color 0.5s ease';
                el.style.color = 'white';
            });
        }
        
        // Dot Feedback (Just a pulse, no expansion)
        wrapper.style.transition = 'transform 0.5s ease';
    }, 100);

    // 3. VANISH
    setTimeout(() => {
        footer.style.opacity = '0';
        footer.style.transform = 'translate(-50%, 20px) scale(0.9)'; // Drop down slightly
        
        // TRIGGER NEXT STAGE CALLBACK HERE
        if(callback) callback();
        
    }, 1200);

    // 4. RETURN (Delayed to happen after the random effect finishes usually, or just restore it)
    // We restore the footer after 5s regardless, acting as the "cleanup" crew
    setTimeout(() => {
        // Reset styles
        wrapper.style.transform = 'scale(1)';
        
        if (pingDot) pingDot.classList.add('animate-ping');
        
        footer.style.transform = ''; // Reset transform
        
        requestAnimationFrame(() => {
             footer.style.opacity = '1';
             const footerBg = footer.querySelector('div');
             if(footerBg) {
                 footerBg.style.backgroundColor = '';
                 footerBg.style.borderColor = '';
                 footerBg.style.boxShadow = '';
                 footerBg.querySelectorAll('*').forEach(el => el.style.color = '');
             }
             resetEgg();
        });
    }, 6000); // Slightly longer delay to allow the random effect to shine
}

export function resetEgg() {
    eggClickCount = 0;
    const pingDot = document.getElementById('status-dot-ping');
    const coreDot = document.getElementById('status-dot-core');
    const wrapper = document.getElementById('status-dot-wrapper');
    
    if (pingDot && coreDot && wrapper) {
        // Restore styles (Green + Hover Yellow)
        pingDot.classList.remove('bg-red-500');
        pingDot.classList.add('bg-green-400', 'group-hover:bg-yellow-400');
        pingDot.style.animationDuration = '';
        
        coreDot.classList.remove('bg-red-600');
        coreDot.classList.add('bg-green-500', 'group-hover:bg-yellow-500');
        
        wrapper.style.transform = '';
        wrapper.style.animation = '';
        wrapper.classList.remove('opacity-0', 'scale-0');
    }
}

export function triggerConfetti(forcedEffect = null) {
    const { isMobile } = window;
    // Randomize effects
    const effects = [
        'emoji-rain', 'matrix-rain', 'spin-madness',
        'ascii-tux', 'retro-terminal', 'warp-speed',
        'screen-melt', 'retro-pong', 'element-eater', 'fireworks'
    ];
    
    // Pick effect: forced > random
    const effect = forcedEffect || effects[Math.floor(Math.random() * effects.length)];
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    container.style.overflow = 'hidden';
    container.style.opacity = '0'; // Start hidden
    container.style.transition = 'opacity 0.5s ease-in-out'; // Smooth fade
    document.body.appendChild(container);

    // Trigger Fade In
    requestAnimationFrame(() => {
        container.style.opacity = '1';
    });
    
    // Helper for clean fade out
    const fadeOutAndRemove = (delay) => {
            setTimeout(() => {
                container.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(container)) document.body.removeChild(container);
                    // Reset body overflow
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                }, 500); // Match transition duration
            }, delay);
    };

    // Close Button (Only for long/interactive effects)
    const interactiveEffects = ['retro-pong'];
    if (interactiveEffects.includes(effect)) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = getIcon('close', 'w-6 h-6');
        closeBtn.className = 'fixed top-4 right-4 z-[10000] p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all active:scale-95';
        closeBtn.onclick = () => fadeOutAndRemove(0);
        container.appendChild(closeBtn);
    }

    if (effect === 'emoji-rain') {
        const emojis = ['💥', '📱', '🎉', '🍎', '💻', '🚀', '💊', '👻', '🔞', '🧱'];
        for (let i = 0; i < 60; i++) {
            const el = document.createElement('div');
            el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.position = 'absolute';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-50px';
            el.style.fontSize = (Math.random() * 20 + 20) + 'px';
            el.style.animation = `fall-down ${Math.random() * 2 + 1}s linear forwards`;
            el.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(el);
        }
    } else if (effect === 'matrix-rain') {
        container.style.pointerEvents = 'auto';
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.style.background = 'black';
        container.style.opacity = '0.9';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "01日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ12345789:・.=\"*+-<>¦｜"; 
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = '15px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        const interval = setInterval(drawMatrix, 50);
        
        setTimeout(() => clearInterval(interval), 5000);
        fadeOutAndRemove(5000);
        return;
    } else if (effect === 'spin-madness') {
        document.body.style.transition = 'transform 1s ease-in-out';
        document.body.style.transform = 'rotate(360deg)';
        setTimeout(() => { document.body.style.transform = ''; }, 1000);
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.width = '10px';
            el.style.height = '10px';
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = '50%';
            el.style.top = '50%';
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 500 + 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            el.style.transition = 'all 1s ease-out';
            container.appendChild(el);
            requestAnimationFrame(() => {
                el.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random()*720}deg)`;
                el.style.opacity = '0';
            });
        }
        fadeOutAndRemove(4000);
    } else if (effect === 'ascii-waifu') {
        // Fullscreen overlay background
        container.style.pointerEvents = 'auto'; 
        
        const pre = document.createElement('pre');
        pre.style.position = 'absolute';
        pre.style.top = '50%';
        pre.style.left = '50%';
        pre.style.transformOrigin = 'center center'; 
        pre.style.fontSize = '10px'; 
        pre.style.lineHeight = '10px';
        pre.style.fontFamily = 'monospace';
        pre.style.transition = 'opacity 1s ease-out, color 0.3s ease, background-color 0.3s ease';
        pre.style.opacity = '0';
        pre.style.userSelect = 'none';

        // Theme Manager - Enforce Dark Mode
        const updateTheme = () => {
            // User requested: Always dark background, no invert logic
            container.style.backgroundColor = '#000000';
            pre.style.color = '#ff69b4'; // Pink text
        };
        
        // Initial set
        updateTheme();
        
        // Watch for theme changes removed as per user request


        // Waifu Collection - Add more ASCII art strings to this array
        const waifus = [
            {
                ratio: "3:4",
                art: `
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠉⣀⠤⢿⣿⣷⠦⢤⣈⠉⠙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⡩⢅⣐⣲⣀⠄⢠⣴⣊⡉⢙⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⣿⣿⣿⡿⢛⢥⣶⠶⠆⣌⣵⣾⣛⠛⠛⢿⣷⡎⢙⢶⣄⠀⠈⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⢠⣮⣶⠟⣡⡔⢈⣷⡢⣄⣉⠻⡅⠈⠲⡝⢿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣬⣍⠁⢀⣴⠛⣡⣴⣰⣿⣿⣿⢿⡇⡠⢌⠡⣒⣂⣶⣜⢧⠑⣄⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢨⢸⣿⠏⠣⠾⠟⠀⠛⠙⡂⠈⣊⠁⠌⠢⡀⠜⣦⠙⢿⣿⣿⣿⣿
⣿⣿⣿⣿⡿⠃⢀⣪⡅⠰⠭⠁⠫⠘⢩⡭⠕⣘⣳⡔⣦⡙⣿⣿⣿⡅⠪⡼⣦⡈⢿⣿⣿⣿⣿⣿⣿⡟⠀⡏⣿⡏⠀⣤⡕⣸⣸⡇⢿⣿⣷⢹⣧⢹⡘⢢⠀⠜⢇⠈⢿⣿⣿⣿
⣿⣿⣿⡿⠁⢠⡟⡛⢠⣾⣷⢀⠐⣧⠐⣾⣾⡹⣿⣿⡘⣷⡔⠹⣿⣿⡄⠱⢹⣷⡀⢻⢻⣿⣿⣿⣿⢣⠀⡇⣿⠀⢆⡏⢱⣿⢸⢹⡀⢻⣿⠃⢛⠀⢣⢡⠊⠐⠘⢸⢸⣿⣿⣿
⣿⣿⡟⠁⡅⡞⣰⢃⣿⢻⡇⠘⠄⠹⣆⢨⣿⡇⠟⠓⢐⠘⣪⠀⢹⣿⣿⠀⠃⣿⡇⠀⠇⣿⣿⣿⡏⠌⠈⢳⡌⠀⢸⡏⠞⢩⢰⠀⣷⠸⣿⡇⠸⠸⢌⢸⢀⢰⠁⣼⣿⣿⣿⣿
⣿⡟⡀⢰⠃⠀⡼⢸⢻⢘⠁⠀⣴⢠⠛⡗⡝⣇⠜⠙⢇⠁⠀⠑⠄⡉⢛⠘⠘⠌⠃⠀⣴⣿⣿⣿⣿⠂⢔⣤⢹⠀⠊⣼⠘⠈⠂⠈⢸⠈⠙⠀⠀⢤⡄⢀⡏⢀⣶⣼⣿⣿⣿⣿
⣿⢰⡇⡿⠀⡂⠇⡸⠘⠘⢀⣇⢿⡇⠃⠀⠱⠘⠜⠄⠀⠈⠁⠀⠀⠋⡛⠄⢃⣶⣸⠄⢹⣿⣿⣿⡇⡀⠸⣿⠙⡀⢤⠉⡀⠠⠀⠙⣬⣤⣥⣴⣀⣜⣁⢈⠀⣸⣿⣿⣿⣿⣿⣿
⣿⣿⢇⠀⡄⣰⠸⢈⣆⠀⠀⣠⡄⠀⠀⣷⣄⣄⣁⣶⣀⣠⣤⢊⡎⢂⢴⡄⠈⠏⠘⣰⢨⣿⣿⣿⣧⣿⡀⠸⣧⡁⢎⠆⢳⠐⣦⣴⣾⣿⣿⣿⣿⣿⡿⠈⢇⣸⣿⣿⣿⣿⣿⣿
⣿⣿⣾⣄⢳⠁⡇⠈⢧⢢⠈⠦⣩⣶⣾⣻⣿⣿⣿⣿⣿⣍⣁⢸⠃⣘⠕⣱⡿⠀⣴⣯⣾⣿⣿⣿⣿⣿⣿⣇⠀⢥⣀⠈⢘⠀⠻⠿⣻⣿⣶⣷⡿⠛⣵⣶⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣷⣴⡗⠤⢁⠁⢘⣿⣿⣿⣿⠛⢿⣿⣿⣿⣿⡿⠈⠁⠁⠚⡡⢰⣼⣿⣿⣿⣋⠻⢀⡜⢿⣿⣿⣷⠤⠉⢤⠈⠠⠙⢿⣦⡀⢩⡍⣒⣛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣧⠹⢠⢠⡻⢿⣿⣿⣿⣿⣿⣿⠟⡫⢰⣷⣈⠀⠠⢁⠻⣿⣿⣿⣿⣿⡇⢠⡿⢸⣿⠋⣠⣾⡟⢔⠀⣰⢠⢘⡛⢿⣘⠛⡓⡢⣐⠔⠜⢿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠟⣋⣭⢑⡚⠿⢿⣷⣮⣭⡛⠛⣩⣶⣿⡇⣿⣿⣿⡘⠄⠙⠇⣛⣛⠛⠻⠟⢈⣚⣡⣼⣿⢰⣿⣿⣿⣦⡁⢷⣗⣮⡐⠐⢶⣿⣈⠒⠒⠁⣩⡓⣝⢿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⠃⣾⣿⣿⠷⣿⣿⣶⣮⣉⠩⢤⣾⣿⣿⣿⣇⠻⠿⢿⢿⣷⡦⠠⢈⠉⣁⣐⣤⣿⣿⣿⣿⡿⠸⢿⠿⢿⡇⣿⣌⠻⢷⣹⢀⠀⡉⢿⣷⣄⠱⡎⡙⠪⠇⢉⢻⣿⣿
⣿⣿⣿⣿⢇⣼⡿⢛⣱⣿⣿⣿⣿⣿⣿⣿⣶⣤⣿⣯⣿⣿⣶⣶⣶⢰⢀⣴⣶⣶⡌⢿⣿⣿⣿⣿⣿⣿⠃⠊⣍⣭⡀⠠⡙⢁⡴⢗⢶⡄⡷⢁⢸⣿⣿⣷⣦⡙⠻⠿⡫⢸⣿⣿
⣿⣿⣿⣿⢸⢋⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢸⢸⡏⣿⣿⣿⠸⣿⣿⣿⣿⣿⣿⣷⣄⢸⠿⣛⡃⠌⠔⣚⠳⢛⠃⠶⣿⡎⠿⠿⢿⡛⢥⣷⣌⢵⢸⣿⣿
⣿⣿⣿⡇⡃⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣋⣽⣿⣿⣿⣿⣿⢸⢸⠃⡼⢟⠩⠬⡛⠿⣿⣿⣿⣿⣿⢟⣴⣿⣷⡾⢠⣿⣿⣿⡖⢡⣶⣾⣿⣿⣿⣿⣿⣿⣿⠟⡄⢸⣿⣿
⣿⣿⣿⠃⡇⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⢏⣴⣿⣿⣿⣿⣿⣿⣿⡟⡇⠃⣭⣤⠮⠤⢨⣵⡜⢿⣿⣿⣧⠺⣿⡖⠂⣡⣿⣿⣿⡿⢡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡾⢠⢸⣿⣿
⣿⣿⣿⢸⣇⢙⠛⢿⣿⣿⣷⣶⣭⣙⡛⠃⢾⣿⣿⣿⣿⣿⣿⣿⣿⢧⣧⠶⢹⣯⡍⠛⣿⣿⣿⣦⡜⣿⣿⣧⠛⠁⢰⣿⣿⣿⢟⠄⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⣺⢸⣿⣿
⡿⢡⠖⢈⡵⠈⣾⣷⣿⣿⣿⣿⣿⣿⣿⣷⣦⣘⠩⢝⣛⣛⣛⣛⣫⣼⣿⢠⣭⣭⢩⡉⠿⣿⣿⣿⣿⠸⠟⢋⣀⣔⣒⣂⠉⠠⠉⠀⡛⠿⣿⣿⣿⣿⣿⡿⣻⡿⢃⡆⣃⣼⣿⣿
⣷⣤⣤⢩⣶⣷⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⡎⣸⡟⣼⣿⢇⣬⡝⠋⡡⢔⡾⢋⢀⣭⡿⠽⣷⣤⣿⡷⢶⣤⣀⠙⢻⡿⠋⠴⣛⣡⣵⣾⣿⣿⣿⣿
⣿⣿⣿⢸⣿⣿⣇⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢣⡿⠃⣫⣴⠟⠉⡠⣪⠞⣡⣾⠹⠈⠁⣴⣿⣿⣿⡟⢻⣶⡌⢀⣷⣄⠐⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⢸⣿⣿⣿⢰⡝⠛⢿⣿⣿⣿⣿⣷⡨⢿⣿⣿⣿⣿⣿⣿⣿⡿⢁⣩⣶⣿⠋⠀⡠⢪⣾⢋⣾⡿⢋⠔⡄⣰⠙⡻⠟⣽⣷⠀⡏⡄⣱⠹⣿⣆⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⢸⡿⣱⣶⡔⠶⠮⠍⣙⠿⠿⣿⣿⣿⣤⣬⣝⣛⠛⣛⠛⠉⣴⣿⣿⣿⢁⡎⡐⢠⡿⢡⡿⠻⠱⡏⡼⢰⣵⢨⡹⡀⠐⢆⡆⣧⣴⣿⣧⢻⣿⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⢸⣵⣿⣿⡇⢱⣿⣿⣶⣮⣥⣒⣪⠭⠭⣽⣿⣿⣿⠖⠙⢰⣿⣿⣿⣿⠜⢀⢡⡟⢀⣾⢣⠁⠃⠰⠇⣾⡇⣾⣿⡇⡸⣿⡇⢿⣿⣿⣿⡸⣿⡇⠀⢸⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⢸⣿⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣮⣭⣛⡻⢷⢀⣛⣛⣛⣁⣠⡎⠌⠈⠸⡿⠀⠀⠄⢳⢀⢻⡇⢫⠿⠁⢵⣹⣷⢸⣿⣿⡿⢸⣿⡷⠀⣸⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⢸⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡈⢿⣿⣿⣿⣿⣧⣸⡀⠐⣿⠀⢠⡄⡈⢠⠸⡇⠀⠓⡀⢲⢪⢽⠸⣿⡟⠇⠸⣿⡇⡇⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡌⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡜⣿⣿⣿⣿⣿⣿⣇⣶⠘⠀⢣⣅⣀⢨⣆⡀⠄⠀⠃⠊⠀⢸⢀⡙⡑⠀⡰⠟⠈⢰⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡇⣿⣿⣿⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢸⣿⣿⣿⣿⣿⠿⠡⠘⠰⣦⣿⣿⣹⣿⣿⣿⣝⣀⣀⣀⠀⠀⠐⡀⣦⣱⢸⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣇⣟⡻⠿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢟⣋⣭⣭⣭⣭⣭⡝⢋⣶⣿⣼⣄⣤⡙⢿⣿⢈⡭⢻⣿⣿⣯⡟⠡⡎⣐⠣⢃⡟⠀⢁⠆⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣶⣯⣝⣻⣿⣿⣿⣿⣿⠠⣙⣛⠋⢵⣾⣿⣿⣿⣿⣿⢏⡟⣡⣿⣿⣿⣿⣿⡸⢟⠠⠙⢷⣵⡿⠿⠟⣛⠃⢀⣁⣐⠀⣉⣤⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢃⠌⢉⡍⠃⠄⡲⢮⢹⣿⢇⡾⢀⣿⡏⣼⣿⣿⣿⠇⠘⢀⣔⣶⣶⣿⣿⡄⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⣫⣶⡁⠆⡎⠰⠎⠐⠸⢸⡆⠟⣾⢱⣾⢟⣵⣿⣿⣿⠏⡴⠀⡹⣿⣿⣿⣿⣿⠿⢘⢂⣴⣶⣶⣍⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡿⣋⣥⣶⣾⣿⣿⣿⣷⡄⠁⣿⡎⣆⢡⢊⠛⢂⣥⣵⣶⣿⣿⣿⣿⣷⣶⣍⠀⢱⣮⣽⣿⣶⣶⠇⡎⣼⣿⣿⣿⣿⣿⣦⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠟⣡⣾⣿⣿⣿⣿⣿⣿⠿⠿⣟⣛⣯⡅⣿⣄⡆⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣼⢱⠿⢿⣿⣿⣿⣿⣿⣿⣶⣌⡻⠿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⢛⣵⣾⣿⣿⣿⠟⣫⣭⣶⣶⣿⣿⣿⣿⣿⣇⢿⣿⡸⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⣽⣿⣿⣿⣿⣿⡿⣸⢇⣏⢚⣤⣌⡙⠿⣟⣿⣿⣿⣿⣿⣷⣶⠭⢝⣛⠿⣿⣿
⣿⣿⣿⣿⣇⣛⣯⣭⣵⣶⡸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⡇⣧⣜⢿⣿⣿⣿⣿⣿⡟⣵⣿⣿⣿⣿⣿⣿⡿⢱⣵⢸⣿⡜⣿⣿⣿⣷⣶⣭⣛⠿⠿⢟⣫⣴⣿⣿⣿⣶⣎⢿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣭⣭⣽⣟⣛⣛⣿⣿⣛⣿⣇⡙⠿⡜⢿⣷⣝⠿⣿⣿⡏⣾⣿⣿⣿⣿⣿⣿⠟⣁⣡⡎⢸⠿⣣⢠⢶⣭⣝⣛⡛⣛⣥⣶⣿⣿⣿⣿⣿⣿⡿⢋⣼
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣷⣬⣛⣳⠄⠍⠘⠻⠿⠿⢿⣛⣫⣥⣴⣾⣿⣷⠌⡈⡰⢣⠏⣿⢿⣿⣿⣿⡿⠿⠿⠿⢿⣟⣛⣭⣶⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣯⣭⣭⣭⣵⣶⣶⣷⣶⣦⣋⡚⢅⣢⣭⣥⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
`
            },
            {
                ratio: "2:3", 
                art: `
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⢛⡛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⣥⣶⣾⣿⣇⠄⣀⢿⣧⣦⡈⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡟⡛⠋⣴⣿⣿⣿⣿⣿⡟⠁⢈⠠⡙⠟⢡⠀⠀⡈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡿⢉⠀⠁⢿⣿⣿⢋⡽⢫⠞⣣⣿⢂⠀⢘⠪⠄⠆⠎⢠⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⠀⠆⠡⠉⠲⣍⠃⡾⣰⢃⣼⠟⡱⠁⡀⣾⢱⡆⣤⠀⡇⣇⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠃⢰⢈⢢⠀⢰⡏⡼⢱⠃⠞⠋⠐⢀⢁⠁⡟⣿⢱⢿⠘⡇⠘⠸⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠈⡀⢾⠀⢆⢣⢀⡄⡏⠈⢀⠁⣀⡚⢸⢠⠃⠋⢸⠈⢀⠄⠀⢨⣼⣿⠿⠛⠉⠉⠉⠉⠉⠙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡇⡆⡇⣿⡇⣈⠀⣼⢸⠘⠀⠛⠐⡻⣷⠀⢸⠉⠆⡀⠂⢸⠀⠄⢀⠟⠁⣀⠄⣠⡴⠀⠀⡄⠀⠀⠀⠊⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠀⠁⡇⡟⡸⠃⠀⡇⡄⠠⢄⡄⣰⡈⣿⣇⣌⢀⠀⠀⠂⠎⠀⠀⠀⢠⢃⣮⡾⢟⡵⢊⡀⠀⡀⡐⠒⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⢰⢠⣇⠰⠑⠑⠲⡇⠇⣧⣔⣺⣿⣿⣿⣿⣿⠁⡠⣰⠄⠀⡀⠀⠀⡆⣾⠋⠠⡿⢁⡾⢁⠸⣿⢸⢰⡇⢠⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⢸⢸⡿⠀⡄⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣯⣴⣮⡕⠁⠀⠀⠀⢸⠘⡑⠂⡀⠀⠘⢀⠀⢲⡏⡄⢸⡇⠘⠀⠀⡆⠆⠈⢛⠛⣛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠀⢸⡇⠀⢡⠀⠀⠀⢨⠻⣿⣿⠿⣿⣿⣿⣿⣿⠏⠀⠀⠀⡀⠀⠏⠀⠀⢸⠃⠀⣀⡋⠀⣾⢠⠁⠎⠀⠀⠀⠀⣾⣿⣿⠿⡈⠼⡧⣳⡌⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣧⣈⠃⠀⠃⠀⢢⠀⠘⢎⣮⣛⠷⠶⠟⠛⠉⠁⠀⠀⡀⠀⢇⢀⠀⠈⣿⠸⢀⠚⠙⠃⡇⠁⠀⠀⠀⠀⠀⠀⢀⣾⡟⡵⢋⡼⡁⣴⣥⢮⢆⠌⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡿⠆⠘⡇⠨⣂⠀⢴⣭⠻⢐⠦⠀⠀⢁⠀⠀⠀⠠⠀⠀⠀⠀⠣⠞⠁⢰⣤⣤⣶⣧⣄⡀⠀⠀⠀⠀⠀⢨⢏⡞⣤⠟⠄⢰⣿⡏⣿⢻⡜⠘⣛⠛⡻⠋⠙⣿⣿⣿⣿
⣿⡿⣫⣷⣞⠻⣤⡘⠄⠪⠃⠛⢋⠈⠇⠁⢇⠠⠾⠆⠀⢠⡎⢀⡄⠀⠀⠀⢀⠀⣾⣿⣿⣿⣿⣿⣷⣶⡞⠀⠀⠀⡜⡼⡰⠁⢀⡚⢼⢏⠁⢣⢸⠇⠃⣿⣿⣿⣦⣄⠸⢿⣿⣿
⣿⣬⢾⣿⣿⣿⣮⡻⣦⣄⣹⢸⣗⣀⡄⠀⠀⢒⠄⡀⠁⢿⣿⣿⣷⡀⡀⠀⡘⠀⠙⢿⣟⠻⣿⣿⡿⠟⠀⠀⠀⠀⠂⢃⠀⠀⠉⠁⢸⠏⡆⡈⠸⠀⠀⣽⠟⣫⣽⢿⡄⡀⢙⣿
⣿⢣⣿⣿⣿⣿⣿⣷⡹⣿⣿⣇⠉⠋⣼⠔⠀⣐⠌⠃⣾⣎⣿⡿⠿⣛⣘⠓⣸⣆⡨⠱⢉⠫⣉⣁⣐⠀⠀⠀⠀⠰⠀⠀⣧⣉⣾⣶⡈⡐⠁⠀⠀⠀⢠⡔⣿⡏⢓⣫⠎⡄⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⢹⣿⣿⣷⢳⠏⢀⣾⠀⣀⠶⡎⡋⢨⢴⣛⢿⣿⣷⣮⡻⠁⠈⠄⡀⡻⢿⣿⠀⠈⠀⠸⠂⠀⢦⣿⣿⣿⣿⣿⣧⡶⠁⠀⠀⡭⠅⠸⠃⠈⡅⠀⡀⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⢰⢎⣿⣿⣿⣦⣤⣭⣤⣵⣎⢤⣶⣷⣔⢿⣿⣦⢻⣿⣿⣿⣿⣷⡌⠀⢿⣷⣤⠀⠘⠃⢐⠊⡀⢡⣙⢧⣊⣽⠿⢟⡁⠀⢰⠸⣀⣀⣄⣿⡿⠋⢃⢰⣿⣿
⣿⣿⣿⣿⣿⣿⣧⢻⡀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣷⠈⣿⣿⣿⣧⢻⣿⣆⢿⣿⣿⣿⣿⣷⠀⠈⢿⣿⠀⡄⣌⠛⢷⣦⡊⢿⠑⢶⣾⣿⣿⠇⠀⡸⢠⣿⣿⣿⣿⡷⠁⢀⣾⣿⣿
⣿⣿⡿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⡏⠰⢻⣿⣿⣿⣿⣧⠀⠈⡟⠂⢣⣦⠻⣦⣉⠻⠶⣅⠔⣤⡍⠛⢐⠦⡅⢑⠍⠻⣙⠉⠀⠗⣼⣿⣿⣿
⣿⣯⣷⣭⣟⣻⣿⣿⢿⣿⣿⠟⣻⣿⣿⣿⣿⡿⣿⡏⣜⢿⣿⣿⡇⣿⠋⣰⣿⣿⣿⣿⣿⣿⡄⣠⢸⣿⣧⢹⢇⣦⣙⣿⣶⣤⡀⠘⠁⡶⠱⣅⠀⠒⣐⠁⠙⢠⠀⠀⣿⣿⣿⣿
⣏⣕⣒⣋⣉⡛⠻⠿⢸⣿⣯⡿⣿⣿⣿⣿⢟⣼⣇⣥⡿⣮⢻⡟⣸⡿⢠⣿⣿⣿⣿⣿⣿⣿⡏⡮⠘⣿⡿⠃⠙⣻⣿⣿⣿⣿⡏⢀⠀⠀⠀⢇⠆⠀⠀⠁⡄⠀⠈⢂⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⢀⢿⡽⣻⣿⣿⣿⣿⣿⢟⣾⣿⡟⢪⠺⣎⣅⢅⢯⢁⠚⣫⣵⣿⣿⣟⣼⣿⡇⠰⠃⢿⣿⠁⢤⣿⣿⣿⢣⢸⢣⢠⣀⠁⡀⣠⢠⡶⡄⡁⠀⠀⠀⠄⢻⣿⣿⣿
⣿⣿⣿⣿⣿⣯⣬⣘⠿⠿⣿⣿⣿⣿⣧⠿⠿⠟⣱⡯⢢⠍⢸⢪⠊⡸⡰⡉⠍⣟⣡⣿⣿⣿⡇⠀⠀⣾⢿⡔⡜⣿⣿⡟⡜⢢⢣⣿⣿⠀⡇⢸⣧⢓⣼⣿⠦⡀⠑⠀⣾⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣱⣿⢆⠅⠍⠈⠀⠄⠑⠕⡴⢤⡿⣿⣿⣿⡏⠀⠀⠀⣿⣮⠃⣷⢻⠏⠬⠥⡛⣿⠻⣿⠀⡇⢸⠿⠈⠻⣥⠞⡹⢀⠀⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⡟⠛⠛⠁⠊⡞⠀⠀⢨⢀⣀⠇⡿⢋⣵⣿⢿⡟⣱⣆⠲⢀⣿⢿⢨⣬⡌⣾⢓⢦⠳⠙⣷⣿⣿⣿⣿⢄⣄⠂⣀⣘⣱⠈⢀⢿⠿⣿⣿
⣯⣝⣛⣻⣛⣛⣛⠛⠛⠉⠉⠁⢀⠀⠀⠠⠀⡀⡊⠴⢁⠀⠀⠁⠂⢩⠰⢷⣿⣿⡷⢿⡊⣻⣿⠀⣿⣿⣷⠜⣛⡛⣻⣬⣵⣧⣶⣯⣿⣿⣿⣿⢨⣶⡿⠿⢿⣿⢔⠂⠀⠂⢹⣿
⣿⣿⣿⣿⣿⠟⠁⡂⡠⠤⢢⠤⣄⠄⢀⠂⢀⠈⠀⠠⡍⠀⡘⠀⢀⢸⠀⣶⣄⡀⠀⠀⠀⠀⠀⢀⠉⡉⠉⢠⡁⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡯⢍⣤⣤⣔⠠⠂⠤⠀⠀⢼⣿
⣿⣿⣿⣿⠋⠀⠊⠠⠄⠀⡠⠄⠐⢬⡂⢀⡻⢱⠂⠀⠀⠀⠁⠀⠂⠘⠐⢸⣿⣿⣷⣤⣀⡀⢔⣒⣤⣴⢖⢜⢳⡙⣻⣭⣭⣭⣉⡹⡛⢛⣿⠿⠇⣚⡛⣼⣿⣷⠀⢂⠂⡀⡌⢿
⣿⣿⡿⠁⢀⠀⠂⣠⢀⠐⠈⢀⢢⠀⠉⢦⢅⢆⡇⠇⢰⣷⣦⡀⠀⢠⢠⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣏⢎⠆⠘⣹⣎⡉⠉⢉⣩⢄⡅⠿⢿⢑⡀⠿⠇⠘⡇⡜⡞⡄⠘⡱⠈⢼
⣿⣿⠁⠰⢁⢀⠀⠠⡇⠁⡠⠂⠃⠀⡄⠠⢡⠾⠣⠀⢸⡿⠿⡃⠀⢸⡘⡄⢠⣴⢰⣶⠆⠀⠭⢉⠄⠙⠎⠀⠀⠀⠉⠉⠚⠋⢁⡫⢖⠀⠀⠘⠿⠃⠀⠀⠌⠸⣀⠀⢁⢰⣾⢸
⣿⠇⠀⢁⡆⠨⡀⡄⠀⢆⠘⡥⡀⠙⣀⢣⣿⡿⣡⣷⣾⣿⣿⡇⠀⠘⠛⠁⠀⠐⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠩⠥⠈⠀⢀⠀⠐⠁⠀⠀⢀⣉⠐⠄⣐⡒⣸
⡟⢐⠀⠚⢸⠐⢣⢀⠌⠈⢀⡈⢟⡄⣰⣁⠙⡰⠿⠿⠿⠟⠋⡀⠄⢀⠀⠀⠀⠀⠀⠄⠀⣼⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⡀⠀⠀⠀⠀⠀⠀⠀⢸⣿⢀⠠⡑⢇⣿
⡇⣤⠘⠐⠆⠀⠻⠧⠃⠀⠸⣣⢈⡄⢛⣵⣿⣿⣆⣀⣶⣿⡇⡀⠀⠰⠀⠀⠀⠀⠀⢀⠶⠍⠂⡀⠀⡀⠄⠀⠀⠀⠀⠀⠀⠀⢀⡠⠬⢒⠁⠀⠀⠀⠀⠀⠀⠸⡿⠘⢷⢌⣾⣿
⣠⣛⢀⡇⠀⠄⠈⣠⡔⠗⠐⢁⣭⣿⣎⢿⣿⣿⣿⣿⣿⡟⣴⡇⠠⢐⠀⠀⠀⠀⠔⠄⠁⢰⣤⡄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⢂⠀⢈⡀⠀⠀⠀⢠⣿⡆⡌⣢⣾⣿⣿
⣿⠛⢸⣷⠈⢠⡆⡡⠽⢈⣴⣿⣿⣿⣿⣎⢿⣿⣿⣿⢏⣾⣿⣿⠀⡁⠀⠀⢠⡄⠀⠀⠀⠸⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣠⣆⢿⣿⢃⣼⡆⠀⠀⠀⣀⢀⡜⡟⣰⡇⣿⣿⣿⣿
⣿⠶⢸⢻⢰⢋⠢⣪⣶⣿⣿⣿⣿⣿⣿⣿⡎⣿⡿⣣⣾⣿⣿⣿⡄⠃⠀⠸⠃⠈⠀⠀⠀⠀⠻⢏⣴⣄⠀⠀⠀⠀⠀⣤⣿⣿⡜⣱⣿⣿⣿⡆⢤⠀⣠⣾⣇⣼⣿⡇⣿⣿⣿⣿
⣿⣤⠸⠿⢔⢅⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡰⣾⣿⣿⣿⣿⣿⡇⠀⠡⢀⣀⣒⣷⣤⣄⣀⠀⠀⠀⠀⠀⠀⢀⣤⣴⣿⣿⣿⣧⢿⣿⣿⣿⣇⣠⣾⣿⣿⣷⢹⣿⡇⣿⣿⣿⣿
⠾⠐⢂⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢿⣿⣿⣿⣿⣿⡇⢃⣴⣿⣿⣿⣿⣿⣿⣿⡇⢾⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⢸⣿⣿⣿⣿⣸⣿⡇⣿⣿⣿⣿
⣤⣤⡀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢸⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿
⣿⣿⣿⣿⡎⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣇⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣇⣿⣿⣿⣿⣿⣿⣇⣿⣿⣿⣿
`
            }
        ];
        
        const selected = waifus[Math.floor(Math.random() * waifus.length)];
        const waifuArt = selected.art;
        
        pre.innerText = waifuArt;
        container.appendChild(pre);
        
        // Auto-scale Logic
        const scaleArt = () => {
            // Get art dimensions (approximate char width/height ratio 0.6)
            const lines = waifuArt.split('\n');
            const artHeight = lines.length;
            const artWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
            
            // Available screen size (with padding)
            const screenW = window.innerWidth * 0.9;
            const screenH = window.innerHeight * 0.9;
            
            // Calculate scale to fit (assuming 10px font size)
            // Char width approx 6px, height 10px
            const charW = 6; 
            const charH = 10;
            
            // Determine Aspect Ratio Correction
            let scaleYCorrection = 1;
            if (selected.ratio) {
                const parts = selected.ratio.split(':');
                if (parts.length === 2) {
                     const rW = parseFloat(parts[0]);
                     const rH = parseFloat(parts[1]);
                     if (rW && rH) {
                         const targetRatio = rW / rH;
                         // Current visual ratio (width / height)
                         const currentRatio = (artWidth * charW) / (artHeight * charH);
                         // scaleYCorrection = currentRatio / targetRatio
                         scaleYCorrection = currentRatio / targetRatio;
                     }
                }
            }

            const scaleX = screenW / (artWidth * charW);
            const scaleY = screenH / (artHeight * charH * scaleYCorrection);
            const scale = Math.min(scaleX, scaleY); // Fit contain
            
            pre.style.transform = `translate(-50%, -50%) scale(${scale}, ${scale * scaleYCorrection})`;
        };

        // Initial scale
        requestAnimationFrame(() => {
            scaleArt();
            pre.style.opacity = '1';
        });
        
        // Update on resize
        window.addEventListener('resize', scaleArt);
        
        // Custom cleanup hook
        const cleanup = () => {
             window.removeEventListener('resize', scaleArt);
             // Cleanup observer removed

             fadeOutAndRemove(0);
        };
        
        // Close controls
        container.onclick = cleanup;
        
        // Close Button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = getIcon('close', 'w-8 h-8');
        closeBtn.className = 'fixed top-8 right-8 z-[10001] p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100';
        if (typeof isMobile === 'function' && isMobile()) closeBtn.style.display = 'none';
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'absolute inset-0 pointer-events-none group';
        btnContainer.appendChild(closeBtn);
        container.appendChild(btnContainer);
        
        closeBtn.style.pointerEvents = 'auto';
        closeBtn.onclick = (e) => {
             e.stopPropagation();
             cleanup();
        };

    } else if (effect === 'ascii-tux') {
        const pre = document.createElement('pre');
        pre.style.position = 'absolute';
        pre.style.top = '50%';
        pre.style.left = '50%';
        pre.style.transform = 'translate(-50%, -50%) scale(0.1)';
        pre.style.fontSize = '12px';
        pre.style.lineHeight = '12px';
        pre.style.color = '#000';
        pre.style.fontFamily = 'monospace';
        pre.style.transition = 'all 0.5s ease-out';
        pre.style.opacity = '0';
        if (document.documentElement.classList.contains('dark')) pre.style.color = '#fff';
        
        const arts = {
            tux: {
                frames: [`
       _nnnn_
      dGGGGMMb
     @p~qp~~qMb
     M|@||@) M|
     @,----.JM|
    JS^\\__/  qKL
   dZP        qKRb
  dZP          qKKb
 fZP            SMMb
 HZM            MMMM
 FqM            MMMM
 __| ".        |\\dS"qML
 |    \`.       | \`' \\Zq
 _)      \\.___.,|     .'
 \\____   )MMMMMP|   .'
      \`-'       \`--'
`],
                animator: (elapsed, baseArt) => {
                    const closedEyes = baseArt.replace('M|@||@)', 'M|-||-)');
                    return (elapsed % 3000 < 150) ? closedEyes : baseArt;
                }
            },
            dragon: {
                frames: [`
                \\||/
                |  @___oo
      /\\  /\\   / (__,,,,|
     ) /^\\) ^\\/ _)
     )   /^\\/   _)
     )   _ /  / _)
 /\\  )/\\/ ||  | )_)
<  >      |(,,) )__)
 ||      /    \\)___)\\
 | \\____(      )___) )___
  \\______(_______;;; __;;;
`],
                animator: (elapsed, baseArt) => {
                    if (elapsed % 2000 < 1000) {
                        return baseArt.replace('o', 'O').replace('o', 'O'); // Eyes open wider
                    }
                    // Fire breath
                    return baseArt.replace('oo', 'oo  🔥🔥🔥');
                }
            },
            amogus: {
                frames: [`
      . 　　　。　　　　•　 　ﾟ　　。 　　.

　　　.　　　 　　.　　　　　。　　 。　. 　

.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

　　ﾟ　　 Blue was An Impostor.　 。　.

　　'　　　 1 Impostor remains 　 　　。

　　ﾟ　　　.　　　. ,　　　　.　 .
`],
                animator: (elapsed, baseArt) => baseArt
            },
            rick: {
                frames: [`
      .---.
     / o o \\
    (   ^   )
     \\  -  /
      |||||
     /|___|\\
    / |   | \\
      |   |
     /     \\
    |       |
`],
                animator: (elapsed, baseArt) => {
                    const lyrics = [
                        "Never gonna give you up",
                        "Never gonna let you down",
                        "Never gonna run around",
                        "and desert you"
                    ];
                    const index = Math.floor(elapsed / 1500) % lyrics.length;
                    
                    // Dancing
                    let art = baseArt;
                    if (Math.floor(elapsed / 250) % 2 === 0) {
                         art = art.replace('/|___|\\', '\\|___|/').replace('(   ^   )', '(   >   )');
                    } else {
                         art = art.replace('(   ^   )', '(   <   )');
                    }
                    
                    return art + "\n\n" + lyrics[index];
                }
            }
        };

        let selectedKey;
        if (effect === 'ascii-waifu') {
             selectedKey = 'waifu';
        } else {
             // Filter out waifu from normal random pool
             const artKeys = Object.keys(arts).filter(k => k !== 'waifu');
             selectedKey = artKeys[Math.floor(Math.random() * artKeys.length)];
        }

        const selectedArt = arts[selectedKey];
        const baseFrame = selectedArt.frames[0];

        pre.innerText = baseFrame;
        container.appendChild(pre);
        
        requestAnimationFrame(() => {
            pre.style.transform = 'translate(-50%, -50%) scale(1.5)';
            pre.style.opacity = '1';
            
            const onMouseMove = (e) => {
                let clientX, clientY;
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const dx = clientX - centerX;
                const dy = clientY - centerY;
                const rotation = Math.max(-30, Math.min(30, dx / 20));
                const lean = Math.max(-0.2, Math.min(0.2, dy / 500));
                pre.style.transform = `translate(-50%, -50%) scale(${1.5 + lean}) rotate(${rotation}deg)`;
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            
            let startTime = Date.now();
            const waddle = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (selectedArt.animator) {
                    pre.innerText = selectedArt.animator(elapsed, baseFrame);
                }
            }, 50);
            
            setTimeout(() => {
                clearInterval(waddle);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('touchmove', onMouseMove);
                pre.style.transition = 'all 0.5s ease-in';
                pre.style.transform = 'translate(-50%, -50%) scale(0) rotate(720deg)';
                pre.style.opacity = '0';
            }, 4000);
        });
        fadeOutAndRemove(4500);
    } else if (effect === 'retro-terminal') {
        container.style.background = '#000';
        container.style.color = '#0f0';
        container.style.fontFamily = 'monospace';
        container.style.padding = '20px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.fontSize = '24px';
        container.innerText = '> SYSTEM COMPROMISED...\n> REBOOTING KERNEL...\n> LOADING...';
        
        setTimeout(() => container.innerText += '\n> ACCESS GRANTED.', 1000);
        setTimeout(() => container.innerText += '\n> JUST KIDDING :P', 2000);
        fadeOutAndRemove(4000);
    } else if (effect === 'warp-speed') {
        container.style.pointerEvents = 'auto'; // Block interaction & Allow Long Press
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.style.background = 'black';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let cx = canvas.width / 2;
        let cy = canvas.height / 2;
        
        class Star {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 2;
                this.y = (Math.random() - 0.5) * canvas.height * 2;
                this.z = Math.random() * 2000 + 500;
                this.pz = this.z;
                this.color = `hsl(${Math.random()*60 + 200}, 100%, 80%)`;
            }
            update(speed) {
                this.z -= speed;
                if (this.z < 1) {
                    this.reset();
                    this.z = 2000;
                    this.pz = this.z;
                }
            }
            draw() {
                const x = cx + (this.x / this.z) * 1000;
                const y = cy + (this.y / this.z) * 1000;
                const px = cx + (this.x / this.pz) * 1000;
                const py = cy + (this.y / this.pz) * 1000;
                this.pz = this.z;
                if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;
                const size = (1 - this.z / 2000) * 4;
                const alpha = (1 - this.z / 2000);
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = size;
                ctx.globalAlpha = alpha;
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
        
        const stars = [];
        for(let i=0; i<800; i++) stars.push(new Star());
        
        let speed = 2;
        let targetSpeed = 2;
        let isAccelerating = false;
        let isStopping = false;
        let stopTimer = null;
        let frame = 0;
        
        // Acceleration Handlers
        const startAccel = (e) => { 
            e.preventDefault();
            // If we were stopping, cancel the stop sequence
            if (isStopping) {
                isStopping = false;
                if (stopTimer) {
                    clearTimeout(stopTimer);
                    stopTimer = null;
                }
            }
            isAccelerating = true;
            targetSpeed = 50; 
        };
        const stopAccel = (e) => {
            e.preventDefault();
            isAccelerating = false;
            targetSpeed = 2; // Return to cruising speed
            
            // Start a timer to eventually stop and exit if no more interaction
            if (stopTimer) clearTimeout(stopTimer);
            stopTimer = setTimeout(() => {
                isStopping = true;
                targetSpeed = 0;
            }, 2000); // Wait 2 seconds before starting full stop
        };

        container.addEventListener('mousedown', startAccel);
        container.addEventListener('touchstart', startAccel, { passive: false });
        
        container.addEventListener('mouseup', stopAccel);
        container.addEventListener('touchend', stopAccel);
        container.addEventListener('mouseleave', stopAccel);

        function animate() {
            // Clear trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Speed Physics
            // Smoothly interpolate speed towards targetSpeed
            speed += (targetSpeed - speed) * 0.05;
            
            // If fully stopped, exit
            if (isStopping && speed < 0.1) {
                 fadeOutAndRemove(0);
                 return; // Stop loop
            }
            
            stars.forEach(star => {
                star.update(speed);
                star.draw();
            });
            frame++;
            if(document.body.contains(container)) requestAnimationFrame(animate);
        }
        animate();
        
        // Hint Text
        const hint = document.createElement('div');
        hint.className = "absolute bottom-10 left-0 right-0 text-center text-cyan-400 font-mono text-sm opacity-50 animate-pulse pointer-events-none select-none";
        hint.innerText = "HOLD TO WARP // RELEASE TO EXIT";
        container.appendChild(hint);

        return;
    } else if (effect === 'fireworks') {
        container.style.background = 'black';
        container.style.pointerEvents = 'auto'; 
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let particles = [];
        let rockets = [];
        
        class Rocket {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = -(Math.random() * 5 + 12);
                this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                this.exploded = false;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.2; // Gravity
                
                if (this.vy >= 0 && !this.exploded) {
                    this.explode();
                    return false; // Remove rocket
                }
                return true;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            explode() {
                for (let i = 0; i < 80; i++) {
                    particles.push(new Particle(this.x, this.y, this.color));
                }
            }
        }
        
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.decay = Math.random() * 0.015 + 0.01;
                this.color = color;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // Gravity
                this.vx *= 0.95; // Friction
                this.vy *= 0.95;
                this.life -= this.decay;
                return this.life > 0;
            }
            draw() {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (Math.random() < 0.05) {
                rockets.push(new Rocket());
            }
            
            rockets = rockets.filter(r => {
                r.draw();
                return r.update();
            });
            
            particles = particles.filter(p => {
                p.draw();
                return p.update();
            });
            
            if (document.body.contains(container)) requestAnimationFrame(animate);
        }
        animate();
        
        // Auto-close after 8 seconds
        setTimeout(() => fadeOutAndRemove(0), 8000);
        
        // Click to launch extra fireworks
        container.onclick = (e) => {
            const r = new Rocket();
            r.x = e.clientX;
            r.y = canvas.height;
            r.vx = (e.clientX - canvas.width/2) / 100; // Slight aim towards center
            rockets.push(r);
        };
        
        return;
    } else if (effect === 'retro-pong') {
        container.style.background = 'rgba(0,0,0,0.85)';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.style.pointerEvents = 'auto'; 
        container.style.cursor = 'none'; 
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let ball = { x: canvas.width/2, y: canvas.height/2, dx: 6, dy: 6, r: 15 };
        let playerY = canvas.height / 2 - 60;
        let aiY = canvas.height / 2 - 60;
        let playerScore = 0;
        let aiScore = 0;
        let isPlayerActive = false;
        let gameOver = false;
        let autoCloseTimer = null;
        
        const onMouseMove = (e) => {
            isPlayerActive = true;
            let targetY = 0;
            
            // Handle Touch
            if (e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                targetY = touch.clientY - 60;
                
                // Allow exiting by touching top corners
                if (touch.clientY < 80 && (touch.clientX < 80 || touch.clientX > window.innerWidth - 80)) {
                    // Let the event propagate to the close button
                    return; 
                }
                
                e.preventDefault(); // Prevent scrolling during gameplay
            } else {
                // Handle Mouse
                targetY = e.clientY - 60;
            }

            playerY = Math.max(0, Math.min(canvas.height - 120, targetY));
            if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null; }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        
        // Add double-tap to exit for mobile
        let lastTap = 0;
        const onTouchEnd = (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                fadeOutAndRemove(0);
            }
            lastTap = currentTime;
        };
        document.addEventListener('touchend', onTouchEnd);

        function resetBall() {
            ball.x = canvas.width/2;
            ball.y = canvas.height/2;
            let dir = Math.random() > 0.5 ? 1 : -1;
            ball.dx = dir * (6 + Math.random() * 2); 
            ball.dy = (Math.random() - 0.5) * 8;
        }
        
        function updatePhysics() {
            if (gameOver) return;
            ball.x += ball.dx;
            ball.y += ball.dy;
            
            if (ball.y - ball.r < 0) {
                ball.y = ball.r;
                ball.dy = Math.abs(ball.dy);
            }
            if (ball.y + ball.r > canvas.height) {
                ball.y = canvas.height - ball.r;
                ball.dy = -Math.abs(ball.dy);
            }
            
            if (ball.dx < 0 && ball.x - ball.r < 40 && ball.x + ball.r > 20 && ball.y + ball.r > playerY && ball.y - ball.r < playerY + 120) {
                ball.dx = Math.abs(ball.dx) + 0.5;
                ball.x = 40 + ball.r;
                let hitPos = (ball.y - (playerY + 60)) / 60;
                ball.dy += hitPos * 3;
            }
            
            if (ball.dx > 0 && ball.x + ball.r > canvas.width - 40 && ball.x - ball.r < canvas.width - 20 && ball.y + ball.r > aiY && ball.y - ball.r < aiY + 120) {
                ball.dx = -(Math.abs(ball.dx) + 0.5);
                ball.x = canvas.width - 40 - ball.r;
            }
            
            if (ball.x < -20) {
                aiScore++;
                resetBall();
            } else if (ball.x > canvas.width + 20) {
                playerScore++;
                resetBall();
            }
            
            let targetY = ball.y - 60;
            aiY += (targetY - aiY) * 0.1;
            aiY = Math.max(0, Math.min(canvas.height - 120, aiY));
            
            if (!isPlayerActive) {
                let pTarget = ball.y - 60;
                playerY += (pTarget - playerY) * 0.09;
                playerY = Math.max(0, Math.min(canvas.height - 120, playerY));
            }
        }
        
        function draw() {
            updatePhysics();
            
            if (playerScore >= 3 || aiScore >= 3) {
                gameOver = true;
            }
            
            if (gameOver) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let resultText = "";
                let color = "#fff";
                if (isPlayerActive) {
                    resultText = playerScore >= 3 ? "YOU WIN!" : "YOU LOSE!";
                    color = playerScore >= 3 ? "#0f0" : "#f00";
                } else {
                    resultText = "DEMO OVER";
                    color = "#aaa";
                }
                ctx.fillStyle = color;
                ctx.font = 'bold 80px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(resultText, canvas.width/2, canvas.height/2 - 20);
                ctx.fillStyle = "#fff";
                ctx.font = '30px monospace';
                ctx.fillText(`${playerScore} - ${aiScore}`, canvas.width/2, canvas.height/2 + 60);
                
                if(!window.pongEnding) {
                    window.pongEnding = true;
                    setTimeout(() => { fadeOutAndRemove(0); window.pongEnding=false; }, 3000);
                }
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#333';
            ctx.setLineDash([10, 15]);
            ctx.beginPath();
            ctx.moveTo(canvas.width/2, 0);
            ctx.lineTo(canvas.width/2, canvas.height);
            ctx.stroke();
            
            ctx.fillStyle = '#444';
            ctx.font = '100px monospace';
            ctx.fillText(playerScore, canvas.width/4, 100);
            ctx.fillText(aiScore, canvas.width*3/4, 100);
            
            ctx.fillStyle = '#666';
            ctx.font = '20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText("FIRST TO 3 WINS", canvas.width/2, 50);
            
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            ctx.fill();

            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#10b981';
            ctx.fillStyle = '#10b981'; 
            ctx.fillRect(20, playerY, 20, 120); 
            ctx.shadowColor = '#f43f5e';
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(canvas.width - 40, aiY, 20, 120);
            ctx.restore();
            
            if(document.body.contains(container)) requestAnimationFrame(draw);
        }
        draw();
        
        autoCloseTimer = setTimeout(() => {
            if (!gameOver) fadeOutAndRemove(0);
        }, 10000);
        
        const observer = new MutationObserver((mutations) => {
            if (!document.body.contains(container)) {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('touchmove', onMouseMove);
                document.removeEventListener('touchend', onTouchEnd);
                observer.disconnect();
                gameOver = true;
            }
        });
        observer.observe(document.body, { childList: true });
        return;
    }
}

