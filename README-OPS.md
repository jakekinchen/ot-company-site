# Onetier Production Ops (SSR via Astro + nginx)

**Generated:** 2025-10-18T14:49:04Z
**Commit:** `687bf85` (branch: `main`)

## Overview

The onetier.com production site runs as a server-side rendered (SSR) Astro application behind nginx with TLS termination via Let's Encrypt. The Node.js SSR server binds to localhost:4321 and is managed by systemd as `onetier.service`. Automated deployments poll the Git origin/main branch every minute via a systemd timer (`onetier-deploy.timer`), rebuilding and restarting the service when new commits are detected. Local commits trigger immediate deployment via Git hooks.

## Architecture Diagram

```
┌──────────┐
│  Client  │
└─────┬────┘
      │ HTTPS (443)
      ▼
┌─────────────────────────────────┐
│  nginx (reverse proxy + TLS)    │
│  /etc/nginx/sites-enabled/      │
│  onetier.com.conf                │
│  TLS: Let's Encrypt             │
└────────────┬────────────────────┘
             │ HTTP (127.0.0.1:4321)
             ▼
┌──────────────────────────────────┐
│  Node SSR (systemd)              │
│  onetier.service                 │
│  /usr/bin/node                   │
│  dist/server/entry.mjs           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Astro App + Static Assets       │
│  /var/www/ot-company-site        │
└──────────────────────────────────┘
```

## Paths & Files

### Repository & Application
* **Repo root:** `/var/www/ot-company-site`
* **Build output:** `/var/www/ot-company-site/dist/`
* **SSR entry point:** `/var/www/ot-company-site/dist/server/entry.mjs`
* **Static artifact dir (unused in SSR mode):** `/var/www/ot-site`

### Systemd Units
* **Application service:** `/etc/systemd/system/onetier.service`
* **Deploy service:** `/etc/systemd/system/onetier-deploy.service`
* **Deploy timer:** `/etc/systemd/system/onetier-deploy.timer`

### Deployment
* **Deploy script:** `/usr/local/bin/ot-deploy`
* **Git hooks:** `.git/hooks/post-commit`, `.git/hooks/post-merge`

### nginx
* **Site config:** `/etc/nginx/sites-available/onetier.com.conf`
* **Active symlink:** `/etc/nginx/sites-enabled/onetier.com.conf`

### TLS Certificates
* **Certificate chain:** `/etc/letsencrypt/live/onetier.com/fullchain.pem`
* **Private key:** `/etc/letsencrypt/live/onetier.com/privkey.pem`

## Runtime Details

### Versions
* **Node:** `v20.19.2`
* **npm:** `9.2.0`
* **Astro:** `^5.12.3` (from package.json)

### Service Status
* **onetier.service:** `active`
* **onetier-deploy.timer:** `active`

### Service Configuration
```
ExecStart=/usr/bin/node dist/server/entry.mjs
```

The service runs from the repository directory (`/var/www/ot-company-site`) with the working directory set to the repo root.

### Live Health Check
```
$ curl -sI https://onetier.com/ | head -n1
HTTP/2 200
```

## Deployment Flow

### Automated Deployment (Timer)

The `onetier-deploy.timer` invokes `onetier-deploy.service` (which runs `/usr/local/bin/ot-deploy`) every minute by default.

**Logic:**
1. **Fetch origin/main:** `git fetch origin main`
2. **Compare local vs remote:**
   - **Up-to-date:** Exit silently
   - **Behind:** Fast-forward merge, rebuild, restart
   - **Diverged:** Log warning, exit (manual intervention required)
3. **Package manager detection:** Checks for `pnpm-lock.yaml`, `yarn.lock`, or `package-lock.json` in that order; defaults to `npm`
4. **Build:** Runs `npm install` (or pnpm/yarn equivalent) + `npm run build`
5. **Restart:** `systemctl restart onetier.service`
6. **Logging:** All output to journald (visible via `journalctl -u onetier-deploy.service`)

### Local Commit Hooks

Git hooks trigger immediate deployment on local commits:

* **`.git/hooks/post-commit`:** Runs `/usr/local/bin/ot-deploy` after every commit
* **`.git/hooks/post-merge`:** Runs `/usr/local/bin/ot-deploy` after every merge (e.g., `git pull`)

These ensure that local development commits are deployed without waiting for the timer.

### Build Commands

The deploy script auto-detects the package manager and runs:

```bash
# Package manager detection order: pnpm → yarn → npm

# Install dependencies
npm install  # or: pnpm install / yarn install

# Build
npm run build  # or: pnpm build / yarn build
```

The `build` script from package.json runs:
```
npm run lint && astro check && astro build
```

## Operations

### Deploy Now (Manual)

Trigger an immediate deployment:

```bash
sudo systemctl start onetier-deploy.service
```

Or run the script directly:

```bash
sudo /usr/local/bin/ot-deploy
```

### View Logs

**Application logs:**
```bash
sudo journalctl -u onetier.service -f
```

**Deployment logs:**
```bash
sudo journalctl -u onetier-deploy.service -f
```

**Combined (app + deploy):**
```bash
sudo journalctl -u onetier.service -u onetier-deploy.service -f
```

### Restart Application

```bash
sudo systemctl restart onetier.service
```

Check status:
```bash
sudo systemctl status onetier.service
```

### Reload nginx

After changing nginx configuration:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Check TLS Certificates

Test renewal (dry-run):
```bash
sudo certbot renew --dry-run
```

View expiration:
```bash
sudo certbot certificates
```

Certbot auto-renewal runs via systemd timer `certbot.timer` (typically twice daily).

## Maintenance

### Upgrade npm (EBADENGINE Warning)

If you see `EBADENGINE` warnings due to npm version mismatch:

```bash
sudo npm install -g npm@10
```

Verify:
```bash
npm -v  # Should show 10.x.x
```

### Rotate GitHub Deploy Key

1. Generate new SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "deploy-key-onetier-$(date +%Y%m%d)" -f ~/.ssh/ot_deploy_new
   ```

2. Add public key to GitHub repository:
   - GitHub → Repository Settings → Deploy keys → Add deploy key
   - Paste contents of `~/.ssh/ot_deploy_new.pub`
   - Grant write access if needed

3. Update Git SSH config (if using custom key):
   ```bash
   # In /var/www/ot-company-site/.git/config
   [core]
       sshCommand = ssh -i /root/.ssh/ot_deploy_new -o IdentitiesOnly=yes
   ```

4. Test:
   ```bash
   cd /var/www/ot-company-site
   sudo -u root ssh -i /root/.ssh/ot_deploy_new -T git@github.com
   ```

5. Remove old deploy key from GitHub

### Change Domain

To migrate to a new domain:

1. **Update nginx config:**
   ```bash
   sudo nano /etc/nginx/sites-available/onetier.com.conf
   # Change server_name directive to new domain
   ```

2. **Obtain new certificate:**
   ```bash
   sudo certbot --nginx -d newdomain.com -d www.newdomain.com
   ```

3. **Test and reload:**
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

4. **Update DNS records** to point to this server's IP

### Switch to Static Adapter

To switch from SSR to static site generation:

1. **Install rsync** (for deployment):
   ```bash
   sudo apt-get install rsync
   ```

2. **Update astro.config.mjs:**
   ```javascript
   import { defineConfig } from 'astro/config';
   // Remove or comment out @astrojs/node adapter

   export default defineConfig({
     // output: 'server',  // Remove this
     output: 'static',      // Add this
   });
   ```

3. **Modify deploy script** to copy static output to `/var/www/ot-site`:
   ```bash
   # Add after build step in /usr/local/bin/ot-deploy:
   rsync -av --delete dist/ /var/www/ot-site/
   ```

4. **Update nginx config:**
   ```nginx
   server {
       server_name onetier.com www.onetier.com;
       root /var/www/ot-site;
       index index.html;

       location / {
           # Remove proxy_pass directives
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Stop and disable SSR service:**
   ```bash
   sudo systemctl stop onetier.service
   sudo systemctl disable onetier.service
   ```

6. **Reload nginx:**
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

## Rollback

To roll back to a specific commit:

1. **Identify target commit:**
   ```bash
   cd /var/www/ot-company-site
   git log --oneline -20
   ```

2. **Reset to commit:**
   ```bash
   sudo git reset --hard <commit-sha>
   ```

3. **Rebuild and restart:**
   ```bash
   sudo /usr/local/bin/ot-deploy
   ```

   Or manually:
   ```bash
   sudo npm install
   sudo npm run build
   sudo systemctl restart onetier.service
   ```

4. **Verify:**
   ```bash
   curl -sI https://onetier.com/
   sudo journalctl -u onetier.service -n 50
   ```

**Note:** If the timer re-fetches origin/main, it may fast-forward again. To prevent this, temporarily disable the timer:
```bash
sudo systemctl stop onetier-deploy.timer
# Perform rollback
# Re-enable when ready:
sudo systemctl start onetier-deploy.timer
```

## Security Notes

### Secrets Management

* **No secrets in repository:** Never commit API keys, passwords, or tokens
* **Runtime secrets:** Store in `/var/www/ot-company-site/.env` (add to `.gitignore`)
* **Astro PUBLIC_ prefix:** Variables prefixed with `PUBLIC_` are bundled into client-side code and exposed to browsers. Use for non-sensitive config only.
* **Server-only secrets:** Use unprefixed environment variables (e.g., `DATABASE_URL`) for server-side secrets

### File Permissions

* **SSH keys:** `chmod 600 ~/.ssh/deploy_key`
* **TLS private keys:** Managed by certbot, owned by root, mode 0600
* **Systemd units:** Owned by root, mode 0644
* **Deploy script:** `/usr/local/bin/ot-deploy` should be executable by root

Example systemd service security:
```ini
[Service]
User=root
WorkingDirectory=/var/www/ot-company-site
Environment="NODE_ENV=production"
# Add more security hardening as needed:
# NoNewPrivileges=true
# PrivateTmp=true
```

### nginx Security Headers

Consider adding to nginx config:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Troubleshooting

### Service Won't Start

```bash
# Check service logs
sudo journalctl -u onetier.service -n 100 --no-pager

# Verify entry point exists
ls -la /var/www/ot-company-site/dist/server/entry.mjs

# Test manually
cd /var/www/ot-company-site
node dist/server/entry.mjs
```

### Build Failures

```bash
# Check deploy logs
sudo journalctl -u onetier-deploy.service -n 100 --no-pager

# Run build manually
cd /var/www/ot-company-site
npm run build
```

### nginx 502 Bad Gateway

Service not running or wrong port:
```bash
sudo systemctl status onetier.service
sudo netstat -tlnp | grep 4321
```

### Port Already in Use

```bash
# Find process using port 4321
sudo lsof -i :4321
# Or
sudo ss -tlnp | grep 4321
```

---

**Version:** Documentation generated from commit `687bf85` on branch `main` at 2025-10-18T14:49:04Z
