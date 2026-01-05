# Deployment Guide

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nerve11/Claude-Code-online)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production:
```bash
vercel --prod
```

## Netlify Deployment

### Via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Via Git Integration

1. Connect your repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

## Puter Hosting

Puter provides native hosting for web applications.

### Method 1: Using Puter Workers

```javascript
// worker.js
router.get('/*', async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  
  try {
    const file = await me.puter.fs.read(`/dist${path}`);
    return new Response(file, {
      headers: { 'Content-Type': getContentType(path) }
    });
  } catch {
    const index = await me.puter.fs.read('/dist/index.html');
    return new Response(index, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
});

function getContentType(path) {
  if (path.endsWith('.html')) return 'text/html';
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return 'text/plain';
}
```

Deploy worker:
```bash
puter deploy worker.js
```

### Method 2: Static File Hosting

1. Build the project:
```bash
npm run build
```

2. Upload to Puter:
```javascript
// Upload script
const fs = require('fs');
const path = require('path');

async function uploadDirectory(localPath, remotePath) {
  const files = fs.readdirSync(localPath);
  
  for (const file of files) {
    const localFilePath = path.join(localPath, file);
    const remoteFilePath = `${remotePath}/${file}`;
    
    if (fs.statSync(localFilePath).isDirectory()) {
      await puter.fs.mkdir(remoteFilePath);
      await uploadDirectory(localFilePath, remoteFilePath);
    } else {
      const content = fs.readFileSync(localFilePath);
      await puter.fs.write(remoteFilePath, content);
      console.log(`Uploaded: ${remoteFilePath}`);
    }
  }
}

uploadDirectory('./dist', '/claude-code-online');
```

## Environment Variables

No environment variables required! Puter.js handles all authentication and API access.

## Custom Domain

### Vercel
1. Go to project settings
2. Add custom domain
3. Configure DNS records

### Netlify
1. Go to domain settings
2. Add custom domain
3. Configure DNS records

### Puter
1. Configure custom domain in Puter dashboard
2. Point DNS to Puter servers

## Performance Optimization

### Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'xterm-vendor': ['xterm', 'xterm-addon-fit', 'xterm-addon-web-links']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### CDN Optimization

- Enable gzip/brotli compression
- Set proper cache headers
- Use CDN for static assets
- Implement service worker for offline support

## Monitoring

### Vercel Analytics
```javascript
// Add to your app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Bugsnag

## Security

### Headers Configuration

Both `netlify.toml` and `vercel.json` include security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer

### CSP (Content Security Policy)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://js.puter.com; 
               connect-src 'self' https://api.puter.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for missing dependencies

### Puter.js Not Loading
- Verify CDN is accessible
- Check browser console for errors
- Ensure proper CORS configuration

### Authentication Issues
- Clear browser cache and cookies
- Check Puter service status
- Verify redirect URIs are configured

## CI/CD

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Cost Considerations

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Free SSL

**Netlify:**
- 100GB bandwidth/month
- 300 build minutes/month
- Free SSL

**Puter:**
- Free AI API usage (user-pays model)
- Free file storage (per user)
- Free authentication

## Support

For deployment issues:
- Create an issue in the repository
- Check [Puter Discord](https://discord.gg/puter)
- Consult platform documentation