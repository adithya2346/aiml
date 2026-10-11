// Builder script to generate the complete restyled Glassmorphism single HTML file
const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>RYTAM 2026 | SPECTRA Association — Official Invitation</title>
  <meta name="description" content="Official Freshers' Party RYTAM for Artificial Intelligence & Machine Learning Juniors. Organized by SPECTRA Association. Unlock your personalized VIP pass!">
  <meta name="theme-color" content="#0d0722">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">

  <!-- Favicon / Brand Tab Icon -->
  <link rel="icon" type="image/png" href="/images/spectra_logo.png">
  <link rel="shortcut icon" type="image/png" href="/images/spectra_logo.png">
  <link rel="apple-touch-icon" href="/images/spectra_logo.png">

  <!-- Google Fonts: Space Grotesk (Heading), Plus Jakarta Sans (Body), Press Start 2P (Arcade Tag) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Press+Start+2P&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">

  <!-- External CDNs for celebration, pass download & live scannable QR generation -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.9.2/confetti.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

  <style>
    /* ==========================================================================
       CRYSTAL GLASSMORPHISM DESIGN SYSTEM (Dark Aesthetic Mountain Theme)
       ========================================================================== */
    :root {
      /* Frosted Glass Settings */
      --glass-blur: 18px;
      --glass-saturate: 180%;
      --glass-bg: rgba(10, 6, 24, 0.62);            /* Tinted crystal glass: allows background to show while ensuring high contrast */
      --glass-bg-elevated: rgba(14, 8, 30, 0.72);   /* Login box & modals */
      --glass-bg-subtle: rgba(255, 255, 255, 0.08); /* Nested cards */
      --glass-border: 1px solid rgba(255, 255, 255, 0.22);
      --glass-border-light: rgba(255, 255, 255, 0.55);
      --glass-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      --glass-shadow-hover: 0 24px 50px rgba(0, 0, 0, 0.6), 0 0 28px rgba(0, 242, 254, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6);
      --glass-radius: 26px;
      --glass-radius-sm: 14px;
      --glass-radius-pill: 9999px;

      /* Core Palette */
      --c-cyan: #00f2fe;
      --c-purple: #9d4edd;
      --c-pink: #f72585;
      --c-blue: #3a86ff;
      --c-amber: #ffb703;
      --c-emerald: #10b981;

      /* High-Contrast Non-Blending Text Colors */
      --bg-canvas: #090416;
      --text-main: #ffffff;
      --text-muted: #e2e8f0;
      --text-dim: #cbd5e1;

      /* Gradients & Gloss Sheen */
      --gloss-sheen: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 100%);
      --grad-neon: linear-gradient(135deg, var(--c-cyan) 0%, #c084fc 50%, var(--c-pink) 100%);
      --grad-holo: linear-gradient(120deg, #ff007f, #7928ca, #00f2fe, #4ade80, #ffb703);

      /* Typography */
      --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-display: 'Space Grotesk', sans-serif;
      --font-arcade: 'Press Start 2P', monospace;

      /* Layout */
      --nav-height: 70px;
      --container-max: 960px;
      --transition-smooth: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Fallback for browsers without backdrop-filter support */
    @supports not (backdrop-filter: blur(1px)) {
      .glass-card, .login-box, .welcome-card, .top-nav, #pass-card, .accordion-item, .detail-card, .mobile-thumb-bar {
        background: rgba(14, 8, 28, 0.95) !important;
      }
    }

    /* Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      -webkit-text-size-adjust: 100%;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-canvas);
      color: var(--text-main);
      line-height: 1.55;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ==========================================================================
       ALPINE MOUNTAIN SUNSET BACKGROUND
       ========================================================================== */
    .ambient-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      background: #0d0618;
    }

    .mountain-backdrop {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(180deg, rgba(8, 4, 18, 0.22) 0%, rgba(10, 6, 24, 0.38) 55%, rgba(6, 3, 16, 0.72) 100%),
        url('/images/mountain_bg.jpg') center 35% / cover no-repeat;
      filter: saturate(115%) contrast(106%);
    }

    .sunset-glow {
      position: absolute;
      top: 15%;
      left: 10%;
      right: 10%;
      height: 420px;
      background: radial-gradient(ellipse at 50% 50%, rgba(255, 140, 0, 0.15) 0%, rgba(247, 37, 133, 0.1) 40%, transparent 75%);
      filter: blur(60px);
      pointer-events: none;
    }

    .mountain-fog {
      position: absolute;
      bottom: -5%;
      left: -15%;
      right: -15%;
      height: 50%;
      background: radial-gradient(ellipse at 50% 100%, rgba(138, 43, 226, 0.15) 0%, rgba(0, 242, 254, 0.08) 35%, transparent 70%);
      filter: blur(50px);
    }

    .ambient-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(circle at 50% 40%, black 40%, transparent 85%);
      -webkit-mask-image: radial-gradient(circle at 50% 40%, black 40%, transparent 85%);
    }

    /* Floating subtle sparkles */
    .glass-sparkle {
      position: absolute;
      width: 5px;
      height: 5px;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 12px 2px #00f2fe;
      animation: sparkleBlink 4s ease-in-out infinite;
    }
    .sparkle-1 { top: 25%; left: 30%; animation-delay: 0s; }
    .sparkle-2 { top: 45%; right: 25%; animation-delay: 1.2s; }
    .sparkle-3 { top: 70%; left: 15%; animation-delay: 2.1s; }
    .sparkle-4 { top: 85%; right: 30%; animation-delay: 3s; }

    @keyframes sparkleBlink {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 0.95; transform: scale(1.5); }
    }

    /* Container */
    .container {
      width: 100%;
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 1.25rem;
      position: relative;
      z-index: 10;
    }

    /* Progress bar */
    #scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: var(--grad-neon);
      z-index: 9999;
      box-shadow: 0 0 12px var(--c-cyan);
      transition: width 0.1s ease-out;
    }

    /* ==========================================================================
       GLASSMORPHISM CARDS (TINTED TRANSPARENT WITH SPECULAR RIM)
       ========================================================================== */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
      border: var(--glass-border);
      border-radius: var(--glass-radius);
      box-shadow: var(--glass-shadow);
      padding: 2.2rem 2.2rem;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      transition: var(--transition-smooth);
    }

    .glass-card::before,
    .login-box::before,
    .welcome-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 45%;
      background: var(--gloss-sheen);
      border-radius: inherit;
      pointer-events: none;
      z-index: 1;
    }

    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--glass-shadow-hover);
      border-color: rgba(255, 255, 255, 0.38);
    }

    /* Typography Contrast Helpers */
    .login-title, .hero-title, .section-title, .ticket-student-info h3 {
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
    }
    .login-desc, .hero-subtitle, .section-subtitle, .detail-info p {
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.75);
    }

    /* Jelly Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.85rem 1.65rem;
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: var(--glass-radius-pill);
      cursor: pointer;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      transition: var(--transition-smooth);
      border: 1px solid rgba(255, 255, 255, 0.4);
      min-height: 46px;
      -webkit-tap-highlight-color: transparent;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, transparent 100%);
      border-radius: inherit;
      pointer-events: none;
    }

    .btn:active {
      transform: scale(0.97);
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.88) 0%, rgba(157, 78, 221, 0.88) 50%, rgba(247, 37, 133, 0.88) 100%);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 25px rgba(157, 78, 221, 0.45), 0 0 18px rgba(0, 242, 254, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.8);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(247, 37, 133, 0.5), 0 0 25px rgba(0, 242, 254, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.95);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: var(--c-cyan);
      color: var(--c-cyan);
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
      transform: translateY(-2px);
    }

    .btn-sm {
      padding: 0.55rem 1.15rem;
      font-size: 0.85rem;
      min-height: 38px;
    }

    /* ==========================================================================
       STICKY NAVIGATION BAR (CLEAN & MINIMAL: NO SHARE / NO THEME TOGGLE)
       ========================================================================== */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 500;
      height: var(--nav-height);
      background: rgba(10, 6, 24, 0.45);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: var(--transition-smooth);
    }

    .nav-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .nav-logo-img {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 14px rgba(0, 242, 254, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6);
      background: #000000;
      flex-shrink: 0;
      transition: var(--transition-smooth);
    }

    .nav-logo-img:hover {
      transform: scale(1.08) rotate(3deg);
    }

    .nav-brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .nav-brand-title {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.02rem;
      letter-spacing: -0.01em;
      color: var(--text-main);
    }

    .nav-brand-sub {
      font-family: var(--font-arcade);
      font-size: 0.52rem;
      color: var(--c-cyan);
      letter-spacing: 0.06em;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--grad-neon);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 800;
      color: #ffffff;
      font-size: 1.1rem;
      box-shadow: 0 0 16px rgba(0, 242, 254, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.7);
      flex-shrink: 0;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .user-meta {
      min-width: 0;
    }

    .user-name-header {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .user-usn-badge {
      font-size: 0.68rem;
      font-family: var(--font-arcade);
      color: var(--c-cyan);
      background: rgba(0, 242, 254, 0.15);
      border: 1px solid rgba(0, 242, 254, 0.35);
      padding: 0.15rem 0.45rem;
      border-radius: var(--glass-radius-sm);
      display: inline-block;
      margin-top: 0.15rem;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    /* ==========================================================================
       LOGIN VIEW / EVENT ENTRANCE
       ========================================================================== */
    #login-view {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.25rem;
      position: relative;
      z-index: 20;
    }

    .login-box {
      width: 100%;
      max-width: 450px;
      background: var(--glass-bg-elevated);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1.5px solid rgba(255, 255, 255, 0.28);
      border-radius: var(--glass-radius);
      padding: 3rem 2.2rem 2.5rem 2.2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 24px 60px rgba(0, 0, 0, 0.55),
        0 0 35px rgba(0, 242, 254, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
      animation: entranceSlide 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes entranceSlide {
      from { opacity: 0; transform: translateY(35px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .login-logo-badge {
      width: 90px;
      height: 90px;
      margin: 0 auto 1.2rem auto;
      border-radius: 24px;
      background: #000000;
      border: 2px solid rgba(0, 242, 254, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 0 35px rgba(157, 78, 221, 0.45),
        0 0 18px rgba(0, 242, 254, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
      animation: logoPulseGlow 3.5s ease-in-out infinite alternate;
      position: relative;
      overflow: hidden;
      padding: 3px;
    }

    .login-logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
      display: block;
    }

    @keyframes logoPulseGlow {
      0% {
        transform: translateY(0) scale(1);
        box-shadow: 0 0 25px rgba(157, 78, 221, 0.4);
      }
      100% {
        transform: translateY(-4px) scale(1.04);
        box-shadow: 0 0 40px rgba(0, 242, 254, 0.55);
      }
    }

    .login-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 6vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-top: 0.75rem;
      line-height: 1.1;
    }

    .login-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      margin-top: 0.45rem;
      margin-bottom: 1.85rem;
      line-height: 1.5;
    }

    .input-group {
      margin-bottom: 1.4rem;
      text-align: left;
    }

    .input-label {
      display: block;
      font-family: var(--font-display);
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
    }

    .usn-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1.1rem;
      font-size: 1.15rem;
      pointer-events: none;
      z-index: 2;
    }

    .usn-input {
      width: 100%;
      height: 54px;
      padding: 0 1rem 0 3.2rem;
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      border-radius: var(--glass-radius-sm);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: var(--transition-smooth);
    }

    .usn-input::placeholder {
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: none;
    }

    .usn-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.16);
      border-color: var(--c-cyan);
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    .login-helper {
      font-size: 0.78rem;
      color: var(--text-dim);
      margin-top: 0.45rem;
      line-height: 1.4;
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.25);
      border: 1px solid rgba(239, 68, 68, 0.6);
      color: #ffffff;
      padding: 0.75rem 1rem;
      border-radius: var(--glass-radius-sm);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
      display: none;
      backdrop-filter: blur(10px);
    }

    .shake-error {
      animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes shake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d(3px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
      40%, 60% { transform: translate3d(5px, 0, 0); }
    }

    /* ==========================================================================
       WELCOME MODAL
       ========================================================================== */
    #welcome-modal {
      position: fixed;
      inset: 0;
      background: rgba(4, 2, 12, 0.75);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1.25rem;
    }

    .welcome-card {
      background: var(--glass-bg-elevated);
      backdrop-filter: blur(26px) saturate(190%);
      -webkit-backdrop-filter: blur(26px) saturate(190%);
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      border-radius: var(--glass-radius);
      padding: 2.8rem 2.2rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 
        0 25px 60px rgba(0, 0, 0, 0.6),
        0 0 45px rgba(0, 242, 254, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
      position: relative;
      overflow: hidden;
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes popIn {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .student-reveal-name {
      font-family: var(--font-display);
      font-size: 1.85rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.5rem 0 1rem 0;
      text-shadow: 0 0 20px rgba(0, 242, 254, 0.6);
    }

    /* ==========================================================================
       MAIN INVITATION PORTAL
       ========================================================================== */
    #app-view {
      display: none;
      position: relative;
      z-index: 10;
      padding-bottom: 6rem;
    }

    .hero-section {
      padding: 3.2rem 0 2.4rem 0;
      text-align: center;
      position: relative;
    }

    .hero-brand-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      margin-bottom: 1rem;
      vertical-align: middle;
    }

    .hero-logo-img {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 0 20px rgba(157, 78, 221, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7);
      background: #000000;
      transition: transform 0.3s ease;
    }

    .hero-logo-img:hover {
      transform: scale(1.1) rotate(3deg);
    }

    .pixel-pill {
      font-family: var(--font-arcade);
      font-size: 0.62rem;
      color: var(--c-cyan);
      background: rgba(0, 242, 254, 0.15);
      border: 1px solid rgba(0, 242, 254, 0.45);
      padding: 0.4rem 0.85rem;
      border-radius: var(--glass-radius-pill);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      letter-spacing: 0.05em;
      backdrop-filter: blur(10px);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--c-emerald);
      box-shadow: 0 0 10px var(--c-emerald);
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .hero-greeting {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0.8rem 0 0.3rem 0;
    }

        .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 7.5vw, 4.2rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
      margin-bottom: 1.1rem;
    }

    .gradient-text {
      background: var(--grad-neon);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 25px rgba(0, 242, 254, 0.45));
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2.8vw, 1.2rem);
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 2.2rem auto;
      line-height: 1.6;
    }

    /* Countdown Tiles */
    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      max-width: 540px;
      margin: 0 auto 2.2rem auto;
    }

    .countdown-card {
      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(170%);
      -webkit-backdrop-filter: blur(16px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--glass-radius-sm);
      padding: 1.15rem 0.6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45);
      transition: var(--transition-smooth);
    }

    .countdown-card:hover {
      transform: translateY(-3px);
      border-color: var(--c-cyan);
      box-shadow: 0 12px 32px rgba(0, 242, 254, 0.35);
    }

    .countdown-value {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4.5vw, 2.5rem);
      font-weight: 800;
      line-height: 1;
      display: block;
      color: #ffffff;
      text-shadow: 0 0 16px rgba(0, 242, 254, 0.6);
    }

    .countdown-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 0.4rem;
      display: block;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Section Headers */
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .section-subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 1.8rem;
    }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.1rem;
    }

    .detail-card {
      background: var(--glass-bg-subtle);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: var(--glass-radius-sm);
      padding: 1.4rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: var(--transition-smooth);
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .detail-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }

    .detail-icon {
      font-size: 1.85rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .detail-info h4 {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--c-cyan);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-info p {
      font-family: var(--font-display);
      font-size: 1.12rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0.2rem;
    }

    .detail-info .sub-text {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    /* Quest Timeline */
    .timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 10px;
      bottom: 10px;
      width: 2px;
      background: linear-gradient(180deg, var(--c-cyan) 0%, var(--c-purple) 50%, var(--c-pink) 100%);
      box-shadow: 0 0 10px var(--c-cyan);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 1.6rem;
      padding-left: 1.25rem;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -2rem;
      top: 5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #090416;
      border: 3px solid var(--c-cyan);
      box-shadow: 0 0 14px var(--c-cyan);
      z-index: 2;
    }

    .timeline-time {
      font-family: var(--font-arcade);
      font-size: 0.65rem;
      color: var(--c-cyan);
      letter-spacing: 0.05em;
    }

    .timeline-title {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0.2rem 0;
    }

    .timeline-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    /* ==========================================================================
       AUTHENTIC VIP PASS (TICKET DESIGN WITH HIGH-TECH QR CODE)
       ========================================================================== */
    .ticket-wrapper {
      margin: 2rem auto;
      max-width: 480px;
      perspective: 1000px;
    }

    #pass-card {
      background: linear-gradient(145deg, #130a2a 0%, #1c0e3a 50%, #0d061c 100%);
      border-radius: 20px;
      border: 2px solid rgba(168, 85, 247, 0.55);
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 24px 60px rgba(0, 0, 0, 0.75),
        0 0 35px rgba(157, 78, 221, 0.35);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
    }

    #pass-card:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 30px 70px rgba(0, 0, 0, 0.8),
        0 0 45px rgba(0, 242, 254, 0.4);
    }

    .ticket-holo-strip {
      height: 8px;
      background: linear-gradient(90deg, #ff007f, #7928ca, #00f2fe, #43e97b, #ff007f);
      background-size: 300% 100%;
      border-radius: 18px 18px 0 0;
      animation: holoShimmer 5s linear infinite;
    }

    @keyframes holoShimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    .ticket-header {
      padding: 1.4rem 1.6rem 1.1rem 1.6rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
      gap: 1rem;
    }

    .ticket-brand-cluster {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 0;
    }

    .ticket-logo-img {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 0 16px rgba(157, 78, 221, 0.5);
      background: #000000;
      flex-shrink: 0;
    }

    .ticket-brand-college {
      font-family: var(--font-display);
      font-size: 0.72rem;
      font-weight: 700;
      color: #00f2fe;
      display: block;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.2rem;
    }

    .ticket-brand-event {
      font-family: var(--font-display);
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      color: #ffffff;
      text-shadow: 0 0 15px rgba(0, 242, 254, 0.6), 0 0 30px rgba(247, 37, 133, 0.4);
      display: block;
      line-height: 1.1;
    }

    .ticket-vip-seal {
      background: linear-gradient(135deg, #ffb703 0%, #fb8500 100%);
      color: #0b071a;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      box-shadow: 0 4px 15px rgba(251, 133, 0, 0.4);
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .ticket-body {
      padding: 1.6rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.4rem;
    }

    .ticket-student-info {
      flex: 1;
      min-width: 0;
    }

    .ticket-guest-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
    }

    .ticket-student-info h3 {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.25rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ticket-usn-tag {
      font-family: var(--font-display);
      font-size: 0.82rem;
      font-weight: 800;
      color: #00f2fe;
      background: rgba(0, 242, 254, 0.14);
      border: 1.5px solid rgba(0, 242, 254, 0.5);
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 1.1rem;
      letter-spacing: 0.06em;
    }

    .ticket-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem 1rem;
    }

    .ticket-meta-item span {
      display: block;
      font-size: 0.7rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .ticket-meta-item strong {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      display: block;
      margin-top: 0.15rem;
    }

    /* High-Definition Realistic QR Code Area */
    .ticket-qr-area {
      flex-shrink: 0;
      text-align: center;
    }

    .qr-box {
      width: 115px;
      height: 115px;
      background: #ffffff;
      border-radius: 14px;
      padding: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .qr-box svg,
    .qr-box img,
    .qr-box canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
      border-radius: 4px;
    }

    .qr-badge {
      font-family: var(--font-display);
      font-size: 0.62rem;
      font-weight: 800;
      color: #00f2fe;
      background: rgba(0, 242, 254, 0.15);
      border: 1px solid rgba(0, 242, 254, 0.4);
      border-radius: 6px;
      padding: 0.2rem 0.55rem;
      display: inline-block;
      margin-top: 0.5rem;
      letter-spacing: 0.06em;
    }

    .qr-caption {
      font-family: monospace;
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      margin-top: 0.3rem;
      letter-spacing: 0.05em;
    }

    .ticket-perforation {
      position: relative;
      padding: 0 1.6rem;
      margin: 0.5rem 0;
    }

    .ticket-dash-line {
      width: 100%;
      height: 1px;
      border-top: 1.5px dashed rgba(255, 255, 255, 0.25);
    }

    .ticket-footer {
      padding: 0.9rem 1.6rem 1.3rem 1.6rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #cbd5e1;
      font-weight: 600;
    }

    .ticket-actions {
      text-align: center;
      margin-top: 1.25rem;
    }

    /* RSVP & Song Request */
    .rsvp-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.4rem;
    }

    .rsvp-btn {
      background: var(--glass-bg-subtle);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 1.4rem 1rem;
      text-align: center;
      cursor: pointer;
      color: var(--text-main);
      transition: var(--transition-smooth);
      position: relative;
      overflow: hidden;
      min-height: 48px;
    }

    .rsvp-btn:hover {
      transform: translateY(-3px);
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .rsvp-btn.selected-yes {
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(16, 185, 129, 0.35) 100%);
      border-color: var(--c-emerald);
      box-shadow: 0 0 28px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .rsvp-btn.selected {
      background: rgba(255, 255, 255, 0.2);
      border-color: var(--c-amber);
      box-shadow: 0 0 25px rgba(255, 183, 3, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .rsvp-emoji {
      font-size: 2.2rem;
      display: block;
      margin-bottom: 0.4rem;
    }

    .rsvp-label {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      display: block;
    }

    .rsvp-feedback {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.28);
      padding: 0.9rem 1.25rem;
      border-radius: var(--glass-radius-sm);
      font-size: 0.92rem;
      margin-bottom: 1.5rem;
      display: none;
      backdrop-filter: blur(12px);
    }

    .song-box {
      margin-top: 1.75rem;
      padding-top: 1.5rem;
      border-top: 1px dashed rgba(255, 255, 255, 0.2);
    }

    .song-input-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.85rem;
    }

    .song-input {
      flex: 1;
      height: 48px;
      padding: 0 1.2rem;
      font-family: var(--font-body);
      font-size: 0.95rem;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(14px);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--glass-radius-pill);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: var(--transition-smooth);
    }

    .song-input:focus {
      outline: none;
      border-color: var(--c-cyan);
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    /* FAQ Accordion */
    .accordion-item {
      background: var(--glass-bg-subtle);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--glass-radius-sm);
      margin-bottom: 0.85rem;
      overflow: hidden;
      transition: var(--transition-smooth);
    }

    .accordion-item:hover {
      border-color: rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.12);
    }

    .accordion-trigger {
      width: 100%;
      padding: 1.15rem 1.4rem;
      background: transparent;
      border: none;
      color: #ffffff;
      font-family: var(--font-display);
      font-size: 1.02rem;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-height: 48px;
    }

    .accordion-icon {
      font-size: 0.85rem;
      color: var(--c-cyan);
      transition: transform 0.3s ease;
    }

    .accordion-item.active .accordion-icon {
      transform: rotate(180deg);
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 0 1.4rem;
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .accordion-item.active .accordion-content {
      max-height: 300px;
      padding-bottom: 1.25rem;
    }

    /* ==========================================================================
       ORGANIZER LEADERSHIP TEAM CONTACT CARDS
       ========================================================================== */
    .site-footer {
      margin-top: 3rem;
      padding: 3rem 0 2rem 0;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.16);
      position: relative;
      z-index: 10;
    }

    .organizer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.1rem;
      margin: 1.75rem auto;
      max-width: 860px;
    }

    .organizer-card {
      background: var(--glass-bg-subtle);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--glass-radius-sm);
      padding: 1.15rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      transition: var(--transition-smooth);
    }

    .organizer-card:hover {
      transform: translateY(-3px);
      border-color: var(--c-cyan);
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 18px rgba(0, 242, 254, 0.25);
    }

    .organizer-name {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.05rem;
      color: #ffffff;
      line-height: 1.2;
    }

    .organizer-role {
      font-family: var(--font-arcade);
      font-size: 0.6rem;
      color: var(--c-cyan);
      margin-top: 0.25rem;
      letter-spacing: 0.04em;
    }

    .organizer-phone {
      font-size: 0.82rem;
      color: var(--text-dim);
      margin-top: 0.2rem;
      font-family: var(--font-body);
      font-weight: 500;
    }

    .organizer-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .contact-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      text-decoration: none;
      font-size: 1.05rem;
      transition: var(--transition-smooth);
    }

    .contact-btn:hover {
      background: var(--c-cyan);
      color: #000000;
      border-color: var(--c-cyan);
      transform: translateY(-2px);
      box-shadow: 0 0 16px var(--c-cyan);
    }

    .contact-btn.wa:hover {
      background: #25d366;
      border-color: #25d366;
      color: #ffffff;
      box-shadow: 0 0 16px #25d366;
    }

    .footer-note {
      font-size: 0.85rem;
      color: var(--text-dim);
      margin-top: 1.4rem;
      line-height: 1.6;
    }

    /* Mobile Quick Thumb-Bar */
    .mobile-thumb-bar {
      display: none;
      position: fixed;
      bottom: 1.1rem;
      left: 1.25rem;
      right: 1.25rem;
      z-index: 600;
      background: rgba(14, 7, 30, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: var(--glass-radius-pill);
      padding: 0.5rem 0.85rem;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.5);
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    /* Back To Top Floating Button */
    .back-to-top {
      position: fixed;
      bottom: 5.5rem;
      right: 1.25rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--glass-bg-elevated);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: var(--c-cyan);
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      z-index: 450;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6);
      transition: var(--transition-smooth);
    }

    .back-to-top:hover {
      background: var(--c-cyan);
      color: #000;
      transform: translateY(-3px);
      box-shadow: 0 0 20px var(--c-cyan);
    }

    /* Loading Overlay */
    #loading-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg-canvas);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.2rem;
      z-index: 99999;
    }

    .cyber-spinner {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.15);
      border-top-color: var(--c-cyan);
      border-right-color: var(--c-pink);
      animation: spin 0.85s linear infinite;
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.4);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    @media (max-width: 640px) {
      .nav-brand-text {
        display: none;
      }
      .user-name-header {
        max-width: 105px;
      }
      .hero-title {
        font-size: 2.2rem;
      }
      .countdown-grid {
        gap: 0.5rem;
      }
      .countdown-card {
        padding: 0.85rem 0.3rem;
      }
      .countdown-value {
        font-size: 1.6rem;
      }
      .rsvp-options {
        grid-template-columns: 1fr;
      }
      .song-input-row {
        flex-direction: column;
      }
      .ticket-body {
        flex-direction: column;
        align-items: flex-start;
      }
      .ticket-qr-area {
        align-self: center;
        margin-top: 0.5rem;
      }
      .mobile-thumb-bar {
        display: flex;
      }
    }
  </style>
</head>

<body>
  <!-- Top Scroll Progress Bar -->
  <div id="scroll-progress" aria-hidden="true"></div>

  <!-- Alpine Mountain Sunset Atmospheric Background -->
  <div class="ambient-bg" aria-hidden="true">
    <div class="mountain-backdrop"></div>
    <div class="sunset-glow"></div>
    <div class="mountain-fog"></div>
    <div class="ambient-grid"></div>
    <div class="glass-sparkle sparkle-1"></div>
    <div class="glass-sparkle sparkle-2"></div>
    <div class="glass-sparkle sparkle-3"></div>
    <div class="glass-sparkle sparkle-4"></div>
  </div>

  <!-- Loading Screen -->
  <div id="loading-overlay">
    <div class="cyber-spinner"></div>
    <div style="font-family: var(--font-arcade); font-size: 0.75rem; color: var(--c-cyan); letter-spacing: 0.08em;">
      INITIALIZING RYTAM ARENA...
    </div>
  </div>


  <!-- ==========================================================================
       STEP 1: EVENT ENTRANCE LOGIN VIEW
       ========================================================================== -->
  <main id="login-view">
    <div class="login-box">
      <!-- Official SPECTRA Emblem Logo -->
      <div class="login-logo-badge" aria-label="SPECTRA Association Logo">
        <img src="/images/spectra_logo.png" alt="SPECTRA Association Logo" class="login-logo-img">
      </div>
      
      <div>
        <span class="pixel-pill">
          <span class="pulse-dot"></span> SPECTRA ASSOCIATION &bull; AIML
        </span>
      </div>

      <h1 class="login-title">
        <span class="gradient-text" id="login-event-name">RYTAM</span>
      </h1>
      
      <p class="login-desc" id="login-event-tagline">
        Organized by SPECTRA Association &bull; Dept. of Artificial Intelligence & Machine Learning
      </p>

      <div id="login-error" class="error-msg" role="alert"></div>

      <form id="login-form" autocomplete="off">
        <div class="input-group">
          <label for="usn-input" class="input-label">Enter your USN</label>
          <div class="usn-input-wrapper">
            <span class="input-icon" aria-hidden="true">🎓</span>
            <input 
              type="text" 
              id="usn-input" 
              class="usn-input" 
              placeholder="Enter your USN" 
              maxlength="15" 
              required
              aria-describedby="usn-hint"
              autofocus
            >
          </div>
          <div id="usn-hint" class="login-helper">Enter your registered AIML USN to unlock your personalized VIP invitation.</div>
        </div>

        <button type="submit" id="login-btn" class="btn btn-primary" style="width: 100%;">
          <span>Unlock My VIP Pass</span> &rarr;
        </button>


      </form>
    </div>
  </main>


  <!-- ==========================================================================
       STEP 2: ACCESS GRANTED ANIMATED MODAL
       ========================================================================== -->
  <div id="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="modal-student-name">
    <div class="welcome-card">
      <div style="font-size: 3.2rem; margin-bottom: 0.4rem;" aria-hidden="true">🎉⚡✨</div>
      <span class="pixel-pill" style="margin-bottom: 0.5rem;">ACCESS GRANTED</span>
      <h2 id="modal-student-name" class="student-reveal-name">Welcome!</h2>
      <p style="color: var(--c-cyan); font-weight: 600; margin-bottom: 1.5rem; font-size: 0.95rem;">
        You are officially invited to RYTAM Freshers 2026!
      </p>
      <button id="enter-portal-btn" class="btn btn-primary" style="width: 100%;">
        Enter The Party Arena &rarr;
      </button>
    </div>
  </div>


  <!-- ==========================================================================
       STEP 3: MAIN INVITATION SITE (PERSONALIZED PORTAL)
       ========================================================================== -->
  <div id="app-view">
    
    <!-- Clean Sticky Navigation: No Share / No Light Theme Toggle -->
    <header class="top-nav">
      <div class="container nav-container">
        <div class="nav-brand">
          <img src="/images/spectra_logo.png" alt="SPECTRA Logo" class="nav-logo-img">
          <div class="nav-brand-text">
            <span class="nav-brand-title">RYTAM</span>
            <span class="nav-brand-sub">SPECTRA &bull; AIML</span>
          </div>
        </div>

        <div class="nav-user">
          <div class="user-avatar" id="nav-avatar">A</div>
          <div class="user-meta">
            <div class="user-name-header" id="nav-student-name">Student Name</div>
            <span class="user-usn-badge" id="nav-student-usn">4GH25AI001</span>
          </div>
        </div>

        <div class="nav-actions">
          <button id="logout-btn" class="btn btn-outline btn-sm" title="Log out">
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="container">
      
      <!-- HERO SECTION -->
      <section class="hero-section reveal" id="hero">
        <div class="hero-brand-container">
          <img src="/images/spectra_logo.png" alt="SPECTRA Logo" class="hero-logo-img">
          <span class="pixel-pill">
            <span class="pulse-dot"></span> SPECTRA ASSOCIATION PRESENTS
          </span>
        </div>

        <div class="hero-greeting">
          <span>👋 Hey</span>
          <span class="gradient-text" id="hero-student-name">Student</span>!
        </div>

        <h1 class="hero-title" id="hero-event-title">
          RYTAM:<br>
          <span class="gradient-text">Freshers 2026</span>
        </h1>

        <p class="hero-subtitle" id="hero-tagline">
          Organized by SPECTRA Association for the Artificial Intelligence & Machine Learning branch! The battle of lectures pauses now. Your seniors have assembled the ultimate kickoff party of the year!
        </p>

        <!-- Live Glass Countdown Tiles -->
        <div class="countdown-grid" role="timer" aria-live="polite">
          <div class="countdown-card">
            <span class="countdown-value" id="cd-days">00</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-value" id="cd-hours">00</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-value" id="cd-minutes">00</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-value" id="cd-seconds">00</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>

        <div class="hero-actions">
          <a href="#ticket-section" class="btn btn-primary">
            <span>🎟️ View VIP Pass</span>
          </a>
          <a href="#rsvp-section" class="btn btn-outline">
            <span>⚡ RSVP Spot</span>
          </a>
        </div>
      </section>


      <!-- PARTY COORDINATES SECTION -->
      <section class="glass-card reveal" id="details" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>📍</span> Party Coordinates
        </h2>
        <p class="section-subtitle">Lock the date and assemble on time with your batchmates</p>

        <div class="details-grid">
          <div class="detail-card">
            <div class="detail-icon">📅</div>
            <div class="detail-info">
              <h4>Date</h4>
              <p id="detail-date">13 October 2026</p>
              <div class="sub-text">Tuesday Morning</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">⏰</div>
            <div class="detail-info">
              <h4>Time</h4>
              <p id="detail-time">9:30 AM onwards</p>
              <div class="sub-text">Morning &bull; Gates open at 9:00 AM</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">🏛️</div>
            <div class="detail-info">
              <h4>Venue</h4>
              <p id="detail-venue">Party Hall, Room No. 332</p>
              <div class="sub-text" id="detail-college">Dept. of Artificial Intelligence & Machine Learning</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">👔</div>
            <div class="detail-info">
              <h4>Dress Code</h4>
              <p id="detail-dresscode">Retro Arcade / Cyber Chic</p>
              <div class="sub-text">Neon, Brights or Smart Casuals</div>
            </div>
          </div>
        </div>
      </section>


      <!-- QUEST TIMELINE SECTION -->
      <section class="glass-card reveal" id="schedule" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>⏳</span> Quest Timeline
        </h2>
        <p class="section-subtitle">Chronological sequence of games, performances, feast & celebrations</p>

        <div class="timeline" id="timeline-container"></div>
      </section>


      <!-- PERSONALIZED VIP PASS (REALISTIC COLLECTOR TICKET WITH MODERN QR CODE) -->
      <section class="glass-card reveal" id="ticket-section" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>🎟️</span> Personalized VIP Pass
        </h2>
        <p class="section-subtitle">Your official digital access pass. Download or screenshot for swift gate entry!</p>

        <div class="ticket-wrapper">
          <div id="pass-card">
            <div class="ticket-holo-strip"></div>
            
            <div class="ticket-header">
              <div class="ticket-brand-cluster">
                <img src="/images/spectra_logo.png" alt="SPECTRA Association Logo" class="ticket-logo-img" crossOrigin="anonymous">
                <div>
                  <span class="ticket-brand-college" id="pass-college">DEPT. OF AIML</span>
                  <span class="ticket-brand-event" id="pass-event-title">RYTAM</span>
                </div>
              </div>
              <div class="ticket-vip-seal">VIP &bull; LEVEL 1</div>
            </div>

            <div class="ticket-body">
              <div class="ticket-student-info">
                <span class="ticket-guest-label">Invited Guest</span>
                <h3 id="pass-student-name">Student Name</h3>
                <div class="ticket-usn-tag" id="pass-student-usn">4GH25AI001</div>
                
                <div class="ticket-meta-grid">
                  <div class="ticket-meta-item">
                    <span>Date</span>
                    <strong id="pass-date">13 Oct 2026</strong>
                  </div>
                  <div class="ticket-meta-item">
                    <span>Time</span>
                    <strong id="pass-time">9:30 AM</strong>
                  </div>
                  <div class="ticket-meta-item">
                    <span>Access Tier</span>
                    <strong style="color: var(--c-cyan);">ALL ACCESS</strong>
                  </div>
                  <div class="ticket-meta-item">
                    <span>Seat Zone</span>
                    <strong style="color: var(--c-amber);">VIP-ROOM332</strong>
                  </div>
                </div>
              </div>

              <!-- High-Tech Scannable VIP Entry QR Code -->
              <div class="ticket-qr-area">
                <div class="qr-box" id="ticket-qr-container" title="Verified Event QR">
                  <svg viewBox="0 0 140 140" fill="#0b071a" xmlns="http://www.w3.org/2000/svg" aria-label="Official VIP Pass QR Code">
                    <!-- Top-Left Finder Pattern -->
                    <rect x="6" y="6" width="36" height="36" rx="6" fill="#0b071a" />
                    <rect x="12" y="12" width="24" height="24" rx="4" fill="#ffffff" />
                    <rect x="17" y="17" width="14" height="14" rx="3" fill="#0b071a" />

                    <!-- Top-Right Finder Pattern -->
                    <rect x="98" y="6" width="36" height="36" rx="6" fill="#0b071a" />
                    <rect x="104" y="12" width="24" height="24" rx="4" fill="#ffffff" />
                    <rect x="109" y="17" width="14" height="14" rx="3" fill="#0b071a" />

                    <!-- Bottom-Left Finder Pattern -->
                    <rect x="6" y="98" width="36" height="36" rx="6" fill="#0b071a" />
                    <rect x="12" y="104" width="24" height="24" rx="4" fill="#ffffff" />
                    <rect x="17" y="109" width="14" height="14" rx="3" fill="#0b071a" />

                    <!-- Alignment Pattern Bottom-Right -->
                    <rect x="98" y="98" width="24" height="24" rx="4" fill="#0b071a" />
                    <rect x="103" y="103" width="14" height="14" rx="2" fill="#ffffff" />
                    <rect x="107" y="107" width="6" height="6" rx="1.5" fill="#0b071a" />

                    <!-- Timing Tracks -->
                    <rect x="48" y="20" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="58" y="20" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="68" y="20" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="78" y="20" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="88" y="20" width="5" height="5" rx="1" fill="#0b071a"/>

                    <rect x="20" y="48" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="20" y="58" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="20" y="68" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="20" y="78" width="5" height="5" rx="1" fill="#0b071a"/>
                    <rect x="20" y="88" width="5" height="5" rx="1" fill="#0b071a"/>

                    <!-- Data Modules Clusters (Realistic High-Density Matrix) -->
                    <rect x="48" y="8" width="8" height="5" rx="1"/>
                    <rect x="62" y="8" width="12" height="5" rx="1"/>
                    <rect x="80" y="8" width="8" height="5" rx="1"/>

                    <rect x="8" y="48" width="6" height="12" rx="1"/>
                    <rect x="8" y="68" width="6" height="8" rx="1"/>
                    <rect x="8" y="84" width="6" height="8" rx="1"/>

                    <rect x="32" y="48" width="8" height="8" rx="1"/>
                    <rect x="46" y="48" width="14" height="6" rx="1"/>
                    <rect x="66" y="48" width="8" height="6" rx="1"/>
                    <rect x="80" y="48" width="12" height="8" rx="1"/>
                    <rect x="100" y="48" width="8" height="8" rx="1"/>
                    <rect x="116" y="48" width="16" height="6" rx="1"/>

                    <rect x="32" y="62" width="6" height="14" rx="1"/>
                    <rect x="44" y="62" width="8" height="8" rx="1"/>
                    <rect x="86" y="62" width="12" height="6" rx="1"/>
                    <rect x="106" y="62" width="6" height="12" rx="1"/>
                    <rect x="120" y="62" width="12" height="8" rx="1"/>

                    <rect x="32" y="82" width="10" height="8" rx="1"/>
                    <rect x="48" y="82" width="6" height="12" rx="1"/>
                    <rect x="60" y="82" width="16" height="6" rx="1"/>
                    <rect x="82" y="82" width="8" height="8" rx="1"/>
                    <rect x="120" y="78" width="12" height="12" rx="1"/>

                    <rect x="48" y="98" width="12" height="8" rx="1"/>
                    <rect x="66" y="98" width="8" height="14" rx="1"/>
                    <rect x="80" y="98" width="12" height="6" rx="1"/>

                    <rect x="48" y="112" width="8" height="14" rx="1"/>
                    <rect x="62" y="118" width="16" height="8" rx="1"/>
                    <rect x="84" y="112" width="8" height="14" rx="1"/>
                    <rect x="98" y="126" width="14" height="8" rx="1"/>
                    <rect x="118" y="126" width="14" height="8" rx="1"/>

                    <rect x="126" y="98" width="8" height="18" rx="1"/>
                    <rect x="108" y="82" width="8" height="8" rx="1"/>

                    <!-- Center Security Shield -->
                    <circle cx="70" cy="70" r="14" fill="#0b071a" />
                    <circle cx="70" cy="70" r="11" fill="url(#qrCenterGrad)" />
                    <defs>
                      <linearGradient id="qrCenterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00f2fe"/>
                        <stop offset="100%" stop-color="#f72585"/>
                      </linearGradient>
                    </defs>
                    <path d="M70 63L75 66V71C75 74.5 70 77 70 77C70 77 65 74.5 65 71V66L70 63Z" fill="#ffffff"/>
                  </svg>
                </div>
                <div class="qr-badge">SCAN FOR ENTRY</div>
                <div class="qr-caption" id="pass-sec-hash">SEC-RYTAM-2026</div>
              </div>
            </div>

            <div class="ticket-perforation" aria-hidden="true">
              <div class="ticket-dash-line"></div>
            </div>

            <div class="ticket-footer">
              <span id="pass-footer-venue">📍 Party Hall (Room 332)</span>
              <span style="color: var(--c-pink);">SPECTRA ASSOCIATION ❤️</span>
            </div>
          </div>
        </div>

        <div class="ticket-actions">
          <button id="download-pass-btn" class="btn btn-primary" style="width: 100%; max-width: 320px;">
            <span>📥 Download VIP Ticket (PNG)</span>
          </button>
          <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 0.6rem;">
            📸 High-res capture formatted for Instagram stories and instant gate scanning.
          </div>
        </div>
      </section>


      <!-- RSVP & SONG REQUEST SECTION -->
      <section class="glass-card reveal" id="rsvp-section" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>📬</span> Will You Be There?
        </h2>
        <p class="section-subtitle">Let your seniors know so we can reserve your welcome kit, badge & feast!</p>

        <div class="rsvp-options" role="radiogroup" aria-label="RSVP Response">
          <button class="rsvp-btn" data-status="yes" role="radio" aria-checked="false">
            <span class="rsvp-emoji">🎉</span>
            <span class="rsvp-label">Count Me In!</span>
            <span style="font-size: 0.75rem; color: var(--text-dim);">100% Hyped</span>
          </button>

          <button class="rsvp-btn" data-status="maybe" role="radio" aria-checked="false">
            <span class="rsvp-emoji">🤔</span>
            <span class="rsvp-label">Maybe</span>
            <span style="font-size: 0.75rem; color: var(--text-dim);">Deciding soon</span>
          </button>

          <button class="rsvp-btn" data-status="no" role="radio" aria-checked="false">
            <span class="rsvp-emoji">😢</span>
            <span class="rsvp-label">Can't Make It</span>
            <span style="font-size: 0.75rem; color: var(--text-dim);">Missing out</span>
          </button>
        </div>

        <div id="rsvp-status-msg" class="rsvp-feedback"></div>

        <!-- DJ Song Request -->
        <div class="song-box">
          <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700;">
            🎵 Drop Your DJ Song Request
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            Which banger is guaranteed to get you sprinting onto the dance floor?
          </p>
          <div class="song-input-row">
            <input 
              type="text" 
              id="song-input" 
              class="song-input" 
              placeholder="e.g. Starboy - The Weeknd / Desi Kalakaar" 
              maxlength="100"
            >
            <button id="song-submit-btn" class="btn btn-primary btn-sm">
              Send Track 🎶
            </button>
          </div>
          <div id="song-feedback" style="font-size: 0.82rem; margin-top: 0.5rem; display: none;"></div>
        </div>
      </section>


      <!-- FAQ ACCORDION SECTION -->
      <section class="glass-card reveal" id="faq" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>❓</span> Frequently Asked Questions
        </h2>
        <p class="section-subtitle">Everything you wondered about RYTAM 2026 answered</p>

        <div id="faq-accordion-container">
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-0">
              <span>Who is eligible to attend RYTAM?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-0" role="region" aria-labelledby="faq-btn-0">
              <p>All newly admitted 1st year students of Artificial Intelligence and Machine Learning are warmly invited! Your USN grants you free VIP entry.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-1">
              <span>Is there any entry fee or pass charge?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-1" role="region" aria-labelledby="faq-btn-1">
              <p>Zero! RYTAM is 100% free and hosted with love by SPECTRA Association and your seniors. There is absolutely no charge for entry, food, welcome kits, or DJ activities.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-2">
              <span>What is the dress code for RYTAM?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-2" role="region" aria-labelledby="faq-btn-2">
              <p>Retro Arcade / Cyber Chic or Smart Party Wear! Wear bright colours, neon accents, cool casuals, jackets, sneakers, or stylish party wear.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-3">
              <span>What do I need to bring at the entrance?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-3" role="region" aria-labelledby="faq-btn-3">
              <p>Just your digital VIP pass (downloaded as PNG or opened on your phone from this website) along with your physical College ID card (or admission slip).</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-4">
              <span>Will food and refreshments be provided?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-4" role="region" aria-labelledby="faq-btn-4">
              <p>Yes! A lavish buffet lunch, welcome drinks, snacks, and delicious desserts will be served for all attendees.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-5">
              <span>Can I bring a friend or plus one from outside?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-5" role="region" aria-labelledby="faq-btn-5">
              <p>To ensure adequate capacity at Party Hall Room 332, entry is strictly restricted to AIML students whose USNs are in the official guest registry.</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-6">
              <span>What activities and events are planned?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-6" role="region" aria-labelledby="faq-btn-6">
              <p>Battle of the batches, talent showcase, icebreakers, senior flash mob, live DJ dance floor, Mr. & Ms. Fresher crowning ceremony, and exciting games with prizes!</p>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-trigger" aria-expanded="false" id="faq-btn-7">
              <span>How do I request songs for the DJ?</span>
              <span class="accordion-icon" aria-hidden="true">&#9660;</span>
            </button>
            <div class="accordion-content" id="faq-content-7" role="region" aria-labelledby="faq-btn-7">
              <p>Use the "Drop Your DJ Song Request" box right above this section on the invitation page! Your track will go straight to the resident DJ queue.</p>
            </div>
          </div>
        </div>
      </section>

    </div><!-- /container -->


    <!-- FOOTER & ORGANIZER CONTACT TEAM -->
    <footer class="site-footer">
      <div class="container">
        <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; margin-bottom: 0.35rem;">
          Need Help? Contact Senior Leadership Team
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-muted);">
          Reach out directly to your student coordinators via phone or WhatsApp:
        </p>

        <div class="organizer-grid" id="organizers-container"></div>

        <div style="margin-top: 2rem;">
          <span class="pixel-pill">RYTAM 2026 &bull; SPECTRA ASSOCIATION &bull; AIML</span>
        </div>

        <p class="footer-note">
          Crafted with 💜 and pure excitement by SPECTRA Association seniors.<br>
          We can't wait to welcome the AIML freshers to campus!
        </p>


      </div>
    </footer>

    <!-- Mobile Quick-Access Floating Bottom Bar -->
    <aside class="mobile-thumb-bar" aria-label="Quick Actions">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.2rem;">🎟️</span>
        <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">RYTAM Pass</span>
      </div>
      <div style="display: flex; gap: 0.45rem;">
        <a href="#ticket-section" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.75rem;">
          View Pass
        </a>
        <a href="#rsvp-section" class="btn btn-primary btn-sm" style="padding: 0.35rem 0.85rem;">
          RSVP Spot
        </a>
      </div>
    </aside>

    <!-- Back to top floating button -->
    <button id="back-to-top" class="back-to-top" aria-label="Scroll to top" title="Scroll to top">
      ↑
    </button>
  </div>


  <!-- ==========================================================================
       JAVASCRIPT: APPLICATION LOGIC
       ========================================================================== -->
  <script>
    /**
     * API Client
     */
    const API = {
      baseUrl: '',

      _headers() {
        const h = { 'Content-Type': 'application/json' };
        const token = sessionStorage.getItem('freshers_token');
        if (token) h['Authorization'] = \`Bearer \${token}\`;
        return h;
      },

      async get(path) {
        try {
          const res = await fetch(this.baseUrl + path, { headers: this._headers() });
          return await res.json();
        } catch {
          return null;
        }
      },

      async post(path, body) {
        try {
          const res = await fetch(this.baseUrl + path, {
            method: 'POST',
            headers: this._headers(),
            body: JSON.stringify(body)
          });
          let data = {};
          try {
            data = await res.json();
          } catch {
            data = { error: 'Server returned response status ' + res.status };
          }
          return { status: res.status, data };
        } catch (fetchErr) {
          return { status: 0, data: { error: 'Network error or server connection refused.' } };
        }
      }
    };


    const DEFAULT_FAQS = [
      {
        q: 'Who is eligible to attend RYTAM?',
        a: 'All newly admitted 1st year students of Artificial Intelligence and Machine Learning are warmly invited! Your USN grants you free VIP entry.'
      },
      {
        q: 'Is there any entry fee or pass charge?',
        a: 'Zero! RYTAM is 100% free and hosted with love by SPECTRA Association and your seniors. There is absolutely no charge for entry, food, welcome kits, or DJ activities.'
      },
      {
        q: 'What is the dress code for RYTAM?',
        a: 'Retro Arcade / Cyber Chic or Smart Party Wear! Wear bright colours, neon accents, cool casuals, jackets, sneakers, or stylish party wear.'
      },
      {
        q: 'What do I need to bring at the entrance?',
        a: 'Just your digital VIP pass (downloaded as PNG or opened on your phone from this website) along with your physical College ID card (or admission slip).'
      },
      {
        q: 'Will food and refreshments be provided?',
        a: 'Yes! A lavish buffet lunch, welcome drinks, snacks, and delicious desserts will be served for all attendees.'
      },
      {
        q: 'Can I bring a friend or plus one from outside?',
        a: 'To ensure adequate capacity at Party Hall Room 332, entry is strictly restricted to AIML students whose USNs are in the official guest registry.'
      },
      {
        q: 'What activities and events are planned?',
        a: 'Battle of the batches, talent showcase, icebreakers, senior flash mob, live DJ dance floor, Mr. & Ms. Fresher crowning ceremony, and exciting games with prizes!'
      },
      {
        q: 'How do I request songs for the DJ?',
        a: 'Use the "Drop Your DJ Song Request" box right above this section on the invitation page! Your track will go straight to the resident DJ queue.'
      }
    ];

    const DEFAULT_TIMELINE = [
      { time: '09:30 AM', title: 'Red Carpet & Junior Welcome', desc: 'Collect your glow bands, badges, refreshments & entry swag.' },
      { time: '10:15 AM', title: 'The Kickoff & SPECTRA Intro', desc: 'SPECTRA Association welcomes AIML freshers with icebreakers & roast session.' },
      { time: '11:00 AM', title: 'Battle of the Batches', desc: 'Interactive multiplayer challenges, talent hunt & casual ramp walk.' },
      { time: '12:15 PM', title: 'Live Performances & Flash Mob', desc: 'College bands & electrifying senior flash mob showcase.' },
      { time: '01:00 PM', title: 'Feast Mode Activated', desc: 'Lavish buffet lunch, desserts, and photo booth madness.' },
      { time: '02:00 PM', title: 'High-Voltage DJ & Dance', desc: 'Turn up the bass on the dance floor with campus resident DJs.' },
      { time: '03:30 PM', title: 'Crowning & Sendoff', desc: 'Announcement of Mr. & Ms. Fresher 2026 followed by farewell cheers.' }
    ];

    /**
     * App State
     */
    const STATE = {
      currentUsn: null,
      currentStudentName: null,
      eventConfig: null,
      countdownInterval: null
    };


    /**
     * DOM Elements Cache
     */
    const DOM = {
      loadingOverlay: document.getElementById('loading-overlay'),
      loginView: document.getElementById('login-view'),
      loginEventName: document.getElementById('login-event-name'),
      loginEventTagline: document.getElementById('login-event-tagline'),
      appView: document.getElementById('app-view'),
      loginForm: document.getElementById('login-form'),
      loginBtn: document.getElementById('login-btn'),
      usnInput: document.getElementById('usn-input'),
      loginError: document.getElementById('login-error'),

      welcomeModal: document.getElementById('welcome-modal'),
      modalStudentName: document.getElementById('modal-student-name'),
      enterPortalBtn: document.getElementById('enter-portal-btn'),

      navStudentName: document.getElementById('nav-student-name'),
      navStudentUsn: document.getElementById('nav-student-usn'),
      navAvatar: document.getElementById('nav-avatar'),
      logoutBtn: document.getElementById('logout-btn'),
      scrollProgress: document.getElementById('scroll-progress'),

      heroStudentName: document.getElementById('hero-student-name'),
      heroEventTitle: document.getElementById('hero-event-title'),
      heroTagline: document.getElementById('hero-tagline'),

      cdDays: document.getElementById('cd-days'),
      cdHours: document.getElementById('cd-hours'),
      cdMinutes: document.getElementById('cd-minutes'),
      cdSeconds: document.getElementById('cd-seconds'),

      detailDate: document.getElementById('detail-date'),
      detailTime: document.getElementById('detail-time'),
      detailVenue: document.getElementById('detail-venue'),
      detailCollege: document.getElementById('detail-college'),
      detailDresscode: document.getElementById('detail-dresscode'),

      timelineContainer: document.getElementById('timeline-container'),
      faqContainer: document.getElementById('faq-accordion-container'),
      organizersContainer: document.getElementById('organizers-container'),

      passCard: document.getElementById('pass-card'),
      passStudentName: document.getElementById('pass-student-name'),
      passStudentUsn: document.getElementById('pass-student-usn'),
      passCollege: document.getElementById('pass-college'),
      passEventTitle: document.getElementById('pass-event-title'),
      passDate: document.getElementById('pass-date'),
      passTime: document.getElementById('pass-time'),
      passSecHash: document.getElementById('pass-sec-hash'),
      passFooterVenue: document.getElementById('pass-footer-venue'),
      downloadPassBtn: document.getElementById('download-pass-btn'),

      rsvpButtons: document.querySelectorAll('.rsvp-btn'),
      rsvpStatusMsg: document.getElementById('rsvp-status-msg'),
      songInput: document.getElementById('song-input'),
      songSubmitBtn: document.getElementById('song-submit-btn'),
      songFeedback: document.getElementById('song-feedback'),

      backToTop: document.getElementById('back-to-top')
    };


    /**
     * INITIALIZATION
     */
    async function initApp() {
      // Default & permanently lock to dark theme
      document.documentElement.setAttribute('data-theme', 'dark');

      setupEventListeners();
      initScrollObservers();

      try {
        // Fetch event config from backend
        STATE.eventConfig = await API.get('/api/event');
        populateEventDetails();
        initCountdown();

        // Check for existing session token
        const savedToken = sessionStorage.getItem('freshers_token');
        if (savedToken) {
          try {
            const meData = await API.get('/api/auth/me');
            if (meData.student) {
              STATE.currentUsn = meData.student.usn;
              STATE.currentStudentName = meData.student.name;
              updatePersonalizedData(meData.rsvp, meData.song);
              hideLoading();
              showAppView();
              return;
            }
          } catch {
            sessionStorage.removeItem('freshers_token');
          }
        }

        hideLoading();
        showLoginView();

      } catch (err) {
        console.error('Init error:', err);
        // Fallback timeline, organizers and FAQs even if backend fails
        populateTimeline(DEFAULT_TIMELINE);
        populateFaqs(DEFAULT_FAQS);
        populateOrganizers();
        hideLoading();
        showLoginView();
      }
    }

    function hideLoading() {
      if (DOM.loadingOverlay) DOM.loadingOverlay.style.display = 'none';
    }


    /**
     * Populates dynamic static details from backend event configuration
     */
    function populateEventDetails() {
      const cfg = STATE.eventConfig;
      if (!cfg) return;

      if (DOM.loginEventName) DOM.loginEventName.textContent = cfg.name ? cfg.name.split(':')[0] : 'RYTAM';
      if (DOM.loginEventTagline) DOM.loginEventTagline.textContent = cfg.tagline || 'Organized by SPECTRA Association • Dept. of Artificial Intelligence & Machine Learning';
      if (DOM.heroEventTitle) {
        const parts = (cfg.name || 'RYTAM: Freshers 2026').split(':');
        DOM.heroEventTitle.innerHTML = \`\${escapeHtml(parts[0])}:<br><span class="gradient-text">\${escapeHtml(parts[1] ? parts[1].trim() : 'Freshers 2026')}</span>\`;
      }
      if (DOM.heroTagline) DOM.heroTagline.textContent = cfg.tagline || 'Organized by SPECTRA Association for Artificial Intelligence & Machine Learning freshers!';

      if (DOM.detailDate) DOM.detailDate.textContent = cfg.displayDate || '13 October 2026';
      if (DOM.detailTime) DOM.detailTime.textContent = cfg.displayTime || '9:30 AM onwards';
      if (DOM.detailVenue) DOM.detailVenue.textContent = cfg.venueName || 'Party Hall, Room No. 332';
      if (DOM.detailCollege) DOM.detailCollege.textContent = cfg.department || 'Dept. of Artificial Intelligence & Machine Learning';
      if (DOM.detailDresscode) DOM.detailDresscode.textContent = cfg.dressCode || 'Retro Arcade / Cyber Chic';

      // Ticket Pass Card
      if (DOM.passCollege) DOM.passCollege.textContent = 'DEPT. OF AIML';
      if (DOM.passEventTitle) DOM.passEventTitle.textContent = (cfg.name || 'RYTAM').split(':')[0].toUpperCase();
      if (DOM.passDate) DOM.passDate.textContent = cfg.displayDate || '13 Oct 2026';
      
      const timeParts = (cfg.displayTime || '9:30 AM').split(' ');
      if (DOM.passTime) DOM.passTime.textContent = timeParts[0] + ' ' + (timeParts[1] || 'AM');
      if (DOM.passFooterVenue) DOM.passFooterVenue.textContent = '📍 ' + (cfg.venueShort || cfg.venueName || 'Party Hall (Room 332)');

      // Timeline Schedule
      const timelineList = (Array.isArray(cfg.timeline) && cfg.timeline.length > 0) ? cfg.timeline : DEFAULT_TIMELINE;
      populateTimeline(timelineList);

      // FAQs
      const faqsList = (Array.isArray(cfg.faqs) && cfg.faqs.length > 0) ? cfg.faqs : DEFAULT_FAQS;
      populateFaqs(faqsList);

      // Leadership Coordinators
      populateOrganizers(cfg.organizers);
    }


    function populateTimeline(items) {
      if (!DOM.timelineContainer) return;
      DOM.timelineContainer.innerHTML = '';
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        el.innerHTML = \`
          <div class="timeline-dot" aria-hidden="true"></div>
          <div class="timeline-time">\${escapeHtml(item.time)}</div>
          <div class="timeline-title">\${escapeHtml(item.title)}</div>
          <div class="timeline-desc">\${escapeHtml(item.desc)}</div>
        \`;
        DOM.timelineContainer.appendChild(el);
      });
    }


    function populateFaqs(faqs) {
      if (!DOM.faqContainer) return;
      DOM.faqContainer.innerHTML = '';
      faqs.forEach((faq, index) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.innerHTML = \`
          <button class="accordion-trigger" aria-expanded="false" id="faq-btn-\${index}">
            <span>\${escapeHtml(faq.q)}</span>
            <span class="accordion-icon" aria-hidden="true">&#9660;</span>
          </button>
          <div class="accordion-content" id="faq-content-\${index}" role="region" aria-labelledby="faq-btn-\${index}">
            <p>\${escapeHtml(faq.a)}</p>
          </div>
        \`;

        const trigger = item.querySelector('.accordion-trigger');
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          DOM.faqContainer.querySelectorAll('.accordion-item').forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            }
          });
          if (isActive) {
            item.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });

        DOM.faqContainer.appendChild(item);
      });
    }


    /**
     * Renders Senior Leadership Contact Cards
     * President, Vice President, Secretary, Joint Secretary
     */
    function populateOrganizers(organizers) {
      if (!DOM.organizersContainer) return;

      const fallbackTeam = [
        { name: 'Adithya CM', role: 'President', phone: '9036580418' },
        { name: 'V Srihari', role: 'Vice President', phone: '9380517743' },
        { name: 'Nikhil HL', role: 'Secretary', phone: '9113545908' },
        { name: 'Likitha N', role: 'Joint Secretary', phone: '8660695730' }
      ];

      const team = (Array.isArray(organizers) && organizers.length) ? organizers : fallbackTeam;
      DOM.organizersContainer.innerHTML = '';

      team.forEach(org => {
        const cleanPhone = String(org.phone).replace(/[^0-9]/g, '');
        const card = document.createElement('div');
        card.className = 'organizer-card';
        card.innerHTML = \`
          <div>
            <div class="organizer-name">\${escapeHtml(org.name)}</div>
            <div class="organizer-role">\${escapeHtml(org.role)}</div>
            <div class="organizer-phone">📞 +91 \${escapeHtml(cleanPhone)}</div>
          </div>
          <div class="organizer-actions">
            <a href="tel:\${cleanPhone}" class="contact-btn" title="Call \${escapeHtml(org.name)}" aria-label="Call \${escapeHtml(org.name)}">
              📞
            </a>
            <a href="https://wa.me/91\${cleanPhone}?text=Hi%20\${encodeURIComponent(org.name)},%20I%20have%20a%20query%20regarding%20RYTAM%20Freshers%202026" 
               target="_blank" rel="noopener noreferrer" class="contact-btn wa" title="WhatsApp \${escapeHtml(org.name)}" aria-label="WhatsApp \${escapeHtml(org.name)}">
              💬
            </a>
          </div>
        \`;
        DOM.organizersContainer.appendChild(card);
      });
    }


    /**
     * AUTHENTICATION & LOGIN
     */
    async function handleLoginSubmit(e) {
      e.preventDefault();
      hideLoginError();

      const rawUsn = DOM.usnInput ? DOM.usnInput.value : '';
      const usn = rawUsn.replace(/[\s-]/g, '').trim().toUpperCase();
      if (!usn) {
        showLoginError('Please enter your registered USN');
        return;
      }
      if (DOM.usnInput) DOM.usnInput.value = usn;

      DOM.loginBtn.disabled = true;
      const originalBtnText = DOM.loginBtn.innerHTML;
      DOM.loginBtn.innerHTML = '<span>⚡ Unlocking Invitation...</span>';

      try {
        const { status, data } = await API.post('/api/auth/login', { usn });

        if (status === 200 && data.success) {
          sessionStorage.setItem('freshers_token', data.token);
          STATE.currentUsn = data.student.usn;
          STATE.currentStudentName = data.student.name;

          updatePersonalizedData(data.rsvp, data.song);

          DOM.modalStudentName.textContent = \`Welcome, \${data.student.name}!\`;
          DOM.welcomeModal.style.display = 'flex';
          triggerConfetti(2);

        } else {
          showLoginError(data.error || 'USN not found. Check with your senior coordinator!');
          shakeElement(document.querySelector('.login-box'));
        }

      } catch (err) {
        console.error('Login error:', err);
        showLoginError('Could not reach the server. Please verify your connection.');
        shakeElement(document.querySelector('.login-box'));
      } finally {
        DOM.loginBtn.disabled = false;
        DOM.loginBtn.innerHTML = originalBtnText;
      }
    }

    function showLoginError(msg) {
      DOM.loginError.textContent = msg;
      DOM.loginError.style.display = 'block';
    }

    function hideLoginError() {
      DOM.loginError.style.display = 'none';
      DOM.loginError.textContent = '';
    }

    function shakeElement(el) {
      if (!el) return;
      el.classList.remove('shake-error');
      void el.offsetWidth;
      el.classList.add('shake-error');
      setTimeout(() => el.classList.remove('shake-error'), 500);
    }


    /**
     * Personalized View Update
     */
    function updatePersonalizedData(existingRsvp, existingSong) {
      const name = STATE.currentStudentName || 'Fresher';
      const usn = STATE.currentUsn || '';

      if (DOM.navStudentName) DOM.navStudentName.textContent = name;
      if (DOM.navStudentUsn) DOM.navStudentUsn.textContent = usn;
      if (DOM.navAvatar) DOM.navAvatar.textContent = name.charAt(0).toUpperCase();

      if (DOM.heroStudentName) DOM.heroStudentName.textContent = name;
      if (DOM.passStudentName) DOM.passStudentName.textContent = name;
      if (DOM.passStudentUsn) DOM.passStudentUsn.textContent = usn;
      if (DOM.passSecHash) DOM.passSecHash.textContent = \`SEC-\${usn.slice(-4) || 'VIP'}-PASS\`;

      if (usn) generatePassQrCode(usn);

      if (existingRsvp) applyRsvpUI(existingRsvp, false);

      if (existingSong && DOM.songInput) {
        DOM.songInput.value = existingSong;
        DOM.songFeedback.style.display = 'block';
        DOM.songFeedback.style.color = 'var(--c-emerald)';
        DOM.songFeedback.textContent = \`✅ Your requested track: "\${existingSong}"\`;
      }
    }

    function generatePassQrCode(usn) {
      const container = document.getElementById('ticket-qr-container');
      if (!container || !usn) return;
      const origin = window.location.origin || 'https://freshers-party-2026-rytam.netlify.app';
      const scanPayload = origin + '/admin.html?scan=' + encodeURIComponent(usn);
      
      function render() {
        if (typeof QRCode !== 'undefined') {
          container.innerHTML = '';
          try {
            new QRCode(container, {
              text: scanPayload,
              width: 100,
              height: 100,
              colorDark: "#0b071a",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch (e) {
            console.warn("QR render fallback:", e);
          }
        } else {
          setTimeout(render, 150);
        }
      }
      render();
    }

    function showAppView() {
      DOM.welcomeModal.style.display = 'none';
      DOM.loginView.style.display = 'none';
      DOM.appView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showLoginView() {
      DOM.appView.style.display = 'none';
      DOM.welcomeModal.style.display = 'none';
      DOM.loginView.style.display = 'flex';
      DOM.usnInput.value = '';
      hideLoginError();
      DOM.usnInput.focus();
    }

    function logoutUser() {
      sessionStorage.removeItem('freshers_token');
      STATE.currentUsn = null;
      STATE.currentStudentName = null;
      showLoginView();
    }


    /**
     * RSVP & SONG REQUEST
     */
    async function handleRsvpClick(btn) {
      const status = btn.getAttribute('data-status');
      try {
        const { data } = await API.post('/api/rsvp', { status });
        if (data.success) {
          applyRsvpUI(status, true);
        }
      } catch (err) {
        console.error('RSVP error:', err);
      }
    }

    function applyRsvpUI(status, shouldCelebrate) {
      DOM.rsvpButtons.forEach(b => {
        b.classList.remove('selected', 'selected-yes');
        b.setAttribute('aria-checked', 'false');
      });

      const activeBtn = document.querySelector(\`.rsvp-btn[data-status="\${status}"]\`);
      if (activeBtn) {
        if (status === 'yes') {
          activeBtn.classList.add('selected-yes');
        } else {
          activeBtn.classList.add('selected');
        }
        activeBtn.setAttribute('aria-checked', 'true');
      }

      DOM.rsvpStatusMsg.style.display = 'block';
      if (status === 'yes') {
        DOM.rsvpStatusMsg.textContent = \`🎉 Awesome \${STATE.currentStudentName}! Your spot has been reserved. See you in Room 332!\`;
        DOM.rsvpStatusMsg.style.color = 'var(--c-emerald)';
        DOM.rsvpStatusMsg.style.borderColor = 'rgba(16, 185, 129, 0.45)';
        if (shouldCelebrate) triggerConfetti(3);
      } else if (status === 'maybe') {
        DOM.rsvpStatusMsg.textContent = \`🤔 Got it, \${STATE.currentStudentName}! We hope you can make it. Reach out to seniors if you have any questions!\`;
        DOM.rsvpStatusMsg.style.color = 'var(--c-amber)';
        DOM.rsvpStatusMsg.style.borderColor = 'rgba(255, 183, 3, 0.45)';
      } else if (status === 'no') {
        DOM.rsvpStatusMsg.textContent = \`😢 We'll miss you, \${STATE.currentStudentName}! If your plans change, feel free to update your RSVP anytime.\`;
        DOM.rsvpStatusMsg.style.color = 'var(--text-muted)';
        DOM.rsvpStatusMsg.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    }

    async function handleSongSubmit() {
      const song = DOM.songInput.value.trim();
      if (!song) {
        DOM.songFeedback.style.display = 'block';
        DOM.songFeedback.style.color = '#f87171';
        DOM.songFeedback.textContent = 'Please enter a song name or artist!';
        return;
      }

      try {
        const { data } = await API.post('/api/song', { song });
        if (data.success) {
          DOM.songFeedback.style.display = 'block';
          DOM.songFeedback.style.color = 'var(--c-emerald)';
          DOM.songFeedback.textContent = \`🎶 Hell yeah! "\${data.song}" added to the party playlist!\`;
          triggerConfetti(1);
        }
      } catch (err) {
        console.error('Song submit error:', err);
        DOM.songFeedback.style.display = 'block';
        DOM.songFeedback.style.color = '#f87171';
        DOM.songFeedback.textContent = 'Failed to submit. Please try again.';
      }
    }


    /**
     * DOWNLOAD FRESHERS PASS (html2canvas)
     */
    async function downloadTicketPass() {
      const originalText = DOM.downloadPassBtn.innerHTML;
      DOM.downloadPassBtn.innerHTML = '<span>⏳ Generating Glass Ticket PNG...</span>';
      DOM.downloadPassBtn.disabled = true;

      try {
        const canvas = await html2canvas(DOM.passCard, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#0c071d',
          logging: false,
          onclone: (clonedDoc) => {
            const card = clonedDoc.getElementById('pass-card');
            if (card) {
              card.style.transform = 'none';
              card.style.boxShadow = 'none';
            }
          }
        });

        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const studentSlug = (STATE.currentStudentName || 'Fresher').replace(/\\s+/g, '_');
        link.download = \`RYTAM2026_VIP_Pass_\${STATE.currentUsn || 'VIP'}_\${studentSlug}.png\`;
        link.href = imageUri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DOM.downloadPassBtn.innerHTML = '<span>✅ Pass Downloaded!</span>';
        triggerConfetti(1.5);

        setTimeout(() => {
          DOM.downloadPassBtn.innerHTML = originalText;
          DOM.downloadPassBtn.disabled = false;
        }, 2500);

      } catch (err) {
        console.error("Pass generation error:", err);
        alert("Could not render automatically. You can take a screenshot of your pass instead!");
        DOM.downloadPassBtn.innerHTML = originalText;
        DOM.downloadPassBtn.disabled = false;
      }
    }


    /**
     * COUNTDOWN TIMER
     */
    function initCountdown() {
      const cfg = STATE.eventConfig;
      if (!cfg || !cfg.targetDate) return;

      const targetTime = new Date(cfg.targetDate).getTime();

      function updateClock() {
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          DOM.cdDays.textContent = '00';
          DOM.cdHours.textContent = '00';
          DOM.cdMinutes.textContent = '00';
          DOM.cdSeconds.textContent = '00';
          clearInterval(STATE.countdownInterval);
          return;
        }

        DOM.cdDays.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        DOM.cdHours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        DOM.cdMinutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        DOM.cdSeconds.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      }

      updateClock();
      STATE.countdownInterval = setInterval(updateClock, 1000);
    }


    /**
     * SCROLL OBSERVERS & MOTION
     */
    function initScrollObservers() {
      window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (DOM.scrollProgress) {
          DOM.scrollProgress.style.width = \`\${scrolled}%\`;
        }

        if (DOM.backToTop) {
          DOM.backToTop.style.display = winScroll > 450 ? 'flex' : 'none';
        }
      }, { passive: true });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.12 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }


    /**
     * CELEBRATORY CONFETTI
     */
    function triggerConfetti(multiplier = 1) {
      if (typeof confetti !== 'function') return;

      const count = 50 * multiplier;
      confetti({
        particleCount: count,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#00f2fe', '#8a2be2', '#f72585', '#ffb703', '#10b981']
      });

      if (multiplier > 1.5) {
        setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00f2fe', '#f72585']
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8a2be2', '#ffb703']
          });
        }, 300);
      }
    }


    /**
     * EVENT LISTENERS
     */
    function setupEventListeners() {
      DOM.loginForm.addEventListener('submit', handleLoginSubmit);
      DOM.enterPortalBtn.addEventListener('click', showAppView);
      DOM.logoutBtn.addEventListener('click', logoutUser);

      DOM.downloadPassBtn.addEventListener('click', downloadTicketPass);

      DOM.rsvpButtons.forEach(btn => {
        btn.addEventListener('click', () => handleRsvpClick(btn));
      });

      DOM.songSubmitBtn.addEventListener('click', handleSongSubmit);
      DOM.songInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSongSubmit();
        }
      });

      if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    document.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
`;

// Write to public/index.html and index.html
fs.writeFileSync(path.join(__dirname, '../public/index.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../index.html'), htmlContent, 'utf8');
console.log('Successfully written clean, high-contrast UI to public/index.html and index.html');
