const fs = require('fs');
const path = require('path');

const env = process.env.ENV || 'production';
const envFile = path.join(__dirname, '..', `.env.${env}`);
if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) process.env[key.trim()] = val.trim();
    });
}

const ENV_LABEL = process.env.ENV_LABEL || env.toUpperCase();
const distDir = path.join(__dirname, '..', 'dist', env);

// Create dist directory
fs.mkdirSync(distDir, { recursive: true });

// Copy all files except node_modules, .git, dist, scripts
const ignore = ['node_modules', '.git', 'dist', 'scripts', '.env.qa', '.env.uat', '.env.production'];

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
        if (ignore.includes(file)) return;
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

copyDir(path.join(__dirname, '..'), distDir);

// Inject env config into index.html
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    const envScript = `<script>window.__ENV__ = { name: '${env}', label: '${ENV_LABEL}', siteUrl: '${process.env.SITE_URL || ''}', analyticsEnabled: ${process.env.ANALYTICS_ENABLED === 'true'} };</script>`;
    html = html.replace('<head>', `<head>\n  ${envScript}`);
    fs.writeFileSync(indexPath, html);
}

console.log(`\n✅ Build complete for ${ENV_LABEL}`);
console.log(`   → Output: dist/${env}/\n`);
