Use node 16:

```
nvm use
```

## Encrypt in NodeJS

```
cd encrypt-in-node
npm i
npm start
```

## Decrypt in React Native

### 1. Create polyfilled version of NodeJS modules for React Native

```
cd crypto-polyfilled
npm i
npm run build
npm pack
```

### 2. Run mobile app

```
cd decrypt-in-rn
npm i
npm start
```

1. Ensure computer and Android phone are connected to the same WiFi network
2. Download and install development client mobile app: https://expo.dev/accounts/nop33/projects/decrypt-in-rn/builds/b6dcdd75-75fd-4e54-bbb0-387657de8f4c
3. Open installed app
4. Scan QR code from terminal, click "Enter URL manually", paste the copied URI, and click "Connect"
5. The app should now start loading and will soon launch, progress is displayed in terminal
