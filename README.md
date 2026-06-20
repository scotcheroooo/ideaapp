# idea.

A private idea vault styled like a vintage file explorer. This package contains the password gate and the main file explorer view, with create, rename, and delete working end to end. The text editor, file locking, and the password management panel arrive in later phases.

## What is inside

```
ideaapp/
  src/
    components/   PasswordGate, Explorer, Breadcrumb, Toolbar, NodeCard, Modal, EmptyState
    lib/          crypto, session, nodes (Firestore CRUD), cn, time
    firebase.js   Firebase initialization
    App.jsx
    index.css
  firestore.rules
  .env.example
```

## Step by step setup

### 1. Unzip and open in VS Code

1. Unzip the file you downloaded.
2. Open VS Code.
3. Choose File, then Open Folder.
4. Select the unzipped `ideaapp` folder.

### 2. Move the project into your GitHub repo

1. Open a terminal in VS Code, choose Terminal then New Terminal.
2. If you have not already cloned your `ideaapp` GitHub repo, run:
```
git clone https://github.com/yourusername/ideaapp.git
```
3. Copy every file and folder from the unzipped package into that cloned repo folder, replacing nothing important since the repo is currently empty.

### 3. Install dependencies

In the terminal, inside the project folder, run:
```
npm install
```

### 4. Connect your Firebase project

1. Go to console.firebase.google.com and open the project you already created.
2. Click the gear icon, then Project settings.
3. Scroll to the Your apps section and click the web app you registered earlier.
4. Copy each value from the config object shown there.
5. In your project folder, create a new file named exactly `.env`
6. Open `.env.example` for reference, then fill in `.env` with your real values, for example:
```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=ideaapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ideaapp
VITE_FIREBASE_STORAGE_BUCKET=ideaapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
```
7. Save the file. This file is already listed in `.gitignore` so it will never be pushed to GitHub.

### 5. Set your Firestore security rules

1. In the Firebase console, click Build then Firestore Database.
2. Click the Rules tab.
3. Delete everything in the editor and paste in the contents of `firestore.rules` from this package.
4. Click Publish.

### 6. Create your first access code

Since the password management panel has not been built yet, you add your first code by hand, directly in the Firebase console.

1. In the Firebase console, click Build then Firestore Database, then the Data tab.
2. Click Start collection.
3. Collection ID: `accessCodes`
4. Click Next, then for Document ID click Auto ID.
5. Add a field named `name`, type string, value your name, for example `james`.
6. Click Add field again, name it `hash`, type string.
7. To get the hash value, open this project locally first by following step 7 below, then open your browser's developer console on the running site, and run:
```
crypto.subtle.digest("SHA-256", new TextEncoder().encode("yourpasswordhere")).then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("")))
```
8. Copy the long string that gets printed, and paste it as the value of the `hash` field.
9. Click Save.

You can repeat this process any time you want to add a new person's access code. The same browser console approach works for any password you choose.

### 7. Run the project locally

```
npm run dev
```
Open the address shown in the terminal, usually `http://localhost:5173`

Enter the plain password you hashed in step 6. If it matches, the gate unlocks into the main file explorer view.

### 8. Push to GitHub and deploy

```
git add .
git commit -m "feat: add password gate and main file explorer view"
git push
```
Cloudflare Pages will pick up the push automatically and redeploy, as long as your Pages project is connected to this repo.

One more setup step on the Cloudflare side, since the `.env` file is never pushed to GitHub:

1. In the Cloudflare dashboard, open your Pages project.
2. Click Settings, then Environment variables.
3. Click Add variable for each of the six `VITE_FIREBASE_` values from your `.env` file, using the same names.
4. Click Save, then trigger a new deployment from the Deployments tab so the build picks up the variables.

## How the access gate works

There is no Firebase Authentication and no traditional login. The app reads every document in the `accessCodes` collection, hashes whatever the visitor typed using the same SHA-256 method, and checks for a match. This is a lightweight privacy gate for a small private tool, not a cryptographically enforced backend rule, since there is no way for Firestore rules to know who passed the gate without real authentication behind it. Treat the link itself as something to share only with people you trust.

## What is next

Once this phase feels solid, the next two phases are the text file editor for opening and writing inside files, and the file locking plus password management panel so you can add and revoke access without touching the Firebase console directly.
