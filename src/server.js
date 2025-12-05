import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// -----------------------------
// MANUAL .env LOADER (no dotenv)
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
    console.log('✔ Environment variables loaded manually');
} else {
    console.log('⚠ .env file not found');
}

// -----------------------------
// EXPRESS APP
// -----------------------------
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3016;

// Middleware
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
