>_ AMAN ANUBHAV // AI RESEARCHER / ENGINEER

🚀 Modern Portfolio V5: Cyber-Aesthetic Interactive Showcase

This repository hosts the code for my personal portfolio, designed to showcase advanced engineering skills, not just static credentials. The site features high-performance UI/UX, client-side encryption, and a custom hybrid AI terminal built using React and the Gemini API.

Live Demo: [Insert Vercel Deployment Link Here]

I. Technical Core & Featured Systems

The portfolio is built on a foundation of performance and security, demonstrating proficiency in MLOps concepts, complex data visualization, and cryptographic implementations.

1. The Interactive Hero Section (E2E & Performance)

The unique landing page combines advanced visual effects with minimal performance impact.

Cyber-Aesthetic Lens: Uses CSS masking (maskImage) over two high-contrast layers to create a "magnifying glass" or "X-ray" effect. Moving the cursor inverts the colors, revealing the hidden, high-contrast text.

Wireframe Tunnel Animation: The background features a custom HTML5 Canvas animation depicting an infinitely deep, swirling "Spider-Web" tunnel. High-speed light bursts travel from the center outwards, simulating intense data transmission and providing a futuristic, dark-space feel.

Smart Scroll: The Navbar implements a custom scroll handler that hides the bar when scrolling down and reveals it instantly when scrolling up, optimizing screen space for content.

2. Secure Vault: Dual-Channel Encrypted Ledger

The Secure Vault is a demonstration of client-side cryptography, proving proficiency in secure data handling and encryption protocols.

Feature

Role / Technology Demonstrated

Security Model

Login/Registration

PBKDF2 Hashing: Password hashing for storage and verification.

Key Derivation

User Messaging

Dual Encryption (AES-256 GCM): Every message is encrypted twice before hitting the database.

E2EE + Escrow

User Privacy

User can only decrypt their own sent messages (userPayload field). Other users see encrypted ciphertext.

Privacy Guarantee

Admin Oversight

Admin (credentials below) can decrypt all messages using a Shared Admin Key (via adminPayload), creating a secure support channel for monitoring/audit.

Secure Channel to Admin

Admin Tools

Admin can NUKE CHAIN, prune individual blocks, and manage user status (block/delete).

Data Governance

Admin Access (For Testing/Audit):

Username: amananubhav

Password: youcantguess

3. Neural Link AI Terminal (Hybrid Chatbot)

This feature demonstrates robust MLOps practices by implementing a tiered fallback system to ensure the user always receives an answer, even if the primary API is offline.

Hybrid Tiers: The terminal first checks local commands (help, bio), then attempts to fetch a response from the Gemini API (using gemini-1.5-flash), and finally falls back to a Local Keyword-Matching Bot if the API fails or is unavailable.

Contextual Reasoning: The Gemini model is supplied with the entire RESUME JSON object as systemInstruction context, allowing it to answer deep, specific questions about projects like YVOO, Liquid Neural Networks, and PAVANA.

Custom Identity: The AI adopts a "sophisticated, slightly cyberpunk AI assistant" persona.

II. Development & Contribution

My Work & Philosophy

My philosophy is centered on being a "Genetically Engineered Learner"—I didn't inherit talent; I built it through obsessive curiosity and implementing knowledge to solve real-world problems (like Climate Tech, FinTech, and AI agents). This portfolio is the physical manifestation of that process.

Project Focus: Bridging the gap between research (LNNs) and production (YVOO, Mario-RL).

Contribution: I designed and implemented 100% of the React components, cryptographic logic, state management, and the custom canvas animations.

Future Concepts (Roadmap)

Full ECDH Key Exchange: Upgrade the Secure Vault from symmetric shared-secret to an Asymmetric (Public Key Infrastructure) model for true cryptographic integrity, requiring users to manage their own key pairs.

MLOps Monitoring: Integrate real-time project metrics (e.g., YVOO model drift data, PAVANA simulation results) into the Terminal or a dedicated dashboard section.

III. Local Setup & Deployment

This project requires Node.js, npm, and a Firebase project setup for data persistence.

Prerequisites

Node.js (v18+)

A Firebase Project (with Firestore enabled).

A Gemini API Key.

Installation

# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/portfolio-v5.git](https://github.com/YOUR_USERNAME/portfolio-v5.git)
cd portfolio-v5

# 2. Install dependencies
npm install

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Configuration

Create .env: In the root directory, create a .env file and populate it with your keys.

VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_GEMINI_API_KEY="AIzaSyCV..." # <-- Use your key here
# ... include all other Firebase details


Run Development Server

npm run dev


Deployment (Recommended: Vercel)

The easiest way to deploy this React/Vite app is via Vercel.

Push your code to a GitHub repository.

Go to Vercel.com and import the repository.

Crucially: Add all VITE_FIREBASE_... and VITE_GEMINI_API_KEY variables to the Environment Variables section in your Vercel project settings.

Deploy. Vercel automatically handles the Vite build process.
