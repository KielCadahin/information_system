# Deploying to Vercel

This project exposes a simple Express-backed API that uses Firebase Admin (Firestore). For Vercel deployment we run the Express app as a serverless function under the `api/` directory and supply Firebase service account values via environment variables.

Required environment variables (set these on Vercel Project Settings or via `vercel env`):

- `FIREBASE_TYPE`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY` (replace newlines with `\n` when adding via CLI or web UI)
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_AUTH_URI`
- `FIREBASE_TOKEN_URI`
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`
- `FIREBASE_CLIENT_X509_CERT_URL`
- `FIREBASE_UNIVERSE_DOMAIN`

Quick deploy steps (recommended):

1. Install Vercel CLI (optional):

```powershell
npm i -g vercel
```

2. Remove the local `serviceAccountKey.json` from the repo (it's currently present locally). Make sure it's not committed. `.gitignore` already contains `serviceAccountKey.json`.

3. Add environment variables in the Vercel dashboard for your project. For the private key the value should include `\n` sequences for newlines. Example (web UI): paste the entire private key but replace actual newlines with `\n`.

4. From the project root, run:

```powershell
vercel --prod
```

The serverless function endpoints will live under `https://<your-deployment>/api/students`.

Notes & troubleshooting:

- Locally you can still run `node server.js` (which uses `serviceAccountKey.json`) for local testing. When deploying to Vercel the function in `api/index.js` uses environment variables.
- If you prefer using the CLI to set env vars, use `vercel env add NAME production` and paste the value when prompted.
- Keep your service account secret safe. Do not commit `serviceAccountKey.json` to a public repository.
