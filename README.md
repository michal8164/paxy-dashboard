**Welcome to your Base44 project**

**About**

View and Edit  your app on [Base44.com](http://Base44.com)

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.


**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)

---

## Deployment

### 1. Build the Application

```bash
npm run build
```

This creates a `dist` folder with static files.

### 2. Mock Data vs. Real Data

The application supports a Mock Mode for local development or preview without a backend.

**For Mock Mode (No Backend):**
Ensure your build environment variables include:
```bash
VITE_USE_MOCK=true
VITE_BASE44_APP_ID=dummy_app_id
VITE_BASE44_APP_BASE_URL=https://dummy-backend.base44.app
```

**For Real Data (Production):**
Set `VITE_USE_MOCK=false` (or remove it) and provide your real Base44 App ID and URL.

### 3. Serving (Nginx Example)

Serve the `dist` folder using Nginx.

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/paxy-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
