const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace placeholders with environment variables
html = html.replace('{{FIREBASE_API_KEY}}', process.env.FIREBASE_API_KEY);
html = html.replace('{{FIREBASE_AUTH_DOMAIN}}', process.env.FIREBASE_AUTH_DOMAIN);
html = html.replace('{{FIREBASE_PROJECT_ID}}', process.env.FIREBASE_PROJECT_ID);
html = html.replace('{{FIREBASE_STORAGE_BUCKET}}', process.env.FIREBASE_STORAGE_BUCKET);
html = html.replace('{{FIREBASE_MESSAGING_SENDER_ID}}', process.env.FIREBASE_MESSAGING_SENDER_ID);
html = html.replace('{{FIREBASE_APP_ID}}', process.env.FIREBASE_APP_ID);
html = html.replace('{{GROQ_API_KEY}}', process.env.GROQ_API_KEY);

fs.writeFileSync('index.html', html);
console.log('✅ Build complete - Environment variables injected!');