# V.I.D.H.A — Android AI Assistant (made by Aarsh)

A voice-and-text personal assistant app skeleton, built with Expo/React Native.
It chats using Claude, speaks its replies out loud, listens via microphone,
and can trigger real Android actions (calling, texting) that the OS actually
permits third-party apps to do.

## What actually works out of the box
- Chat with an AI personality ("V.I.D.H.A", says "I was made by Aarsh" if asked)
- Voice input (speak your command) and voice output (it talks back)
- "Call [name/number]" → opens the dialer
- "Text [name/number] saying [message]" → opens SMS pre-filled
- Easily extendable command list in `services/actions.js`

## What this CANNOT do, and why
Reading your WhatsApp/Instagram DMs or auto-sending replies inside those apps
is **not possible for a normal third-party app**, no matter how it's coded:
- Meta does not provide any public API for personal WhatsApp/Instagram accounts
  to read or send messages on a user's behalf.
- The only technical route apps use for this is abusing Android's
  **Accessibility Service** to read screen content — Google actively bans
  apps that do this for messaging automation, and it's a serious privacy/
  security risk (any app with that permission can effectively read
  everything on your screen, including banking apps and passwords).
- I'm not going to build that in, even as an option — it's the kind of thing
  that gets people's accounts banned or their data stolen by whoever they
  installed it from.

If you want *notifications* (not message content/replies), Android's
`NotificationListenerService` can legitimately tell you "WhatsApp: new
message from X" — that's addable later if you want it, with your explicit
permission grant each time you install.

## Setup

1. Install Node.js (v18+) and Expo CLI:
   ```
   npm install -g expo-cli eas-cli
   ```

2. Install dependencies:
   ```
   cd vidha-app
   npm install
   ```

3. **Set up the backend** (holds your Anthropic API key safely — never put
   a real API key inside app code that gets distributed):
   ```
   cd backend-example
   npm install express cors @anthropic-ai/sdk
   ANTHROPIC_API_KEY=sk-ant-your-key-here node server.js
   ```
   Deploy this for free on Render.com or Railway.app so it's always reachable,
   then put that URL into `services/claudeApi.js` (`BACKEND_URL`).

4. Run the app on your phone during development:
   ```
   npx expo start
   ```
   Scan the QR code with the Expo Go app on your Android phone.

## Building a real installable APK

```
eas build -p android --profile preview
```
This gives you a download link to a `.apk` file you can install directly on
any Android phone (enable "Install unknown apps" in Android settings).

## Publishing it so other people can download it

To list it on the Google Play Store:
1. Create a Google Play Developer account ($25 one-time fee).
2. Run `eas build -p android --profile production` to get an `.aab` file.
3. Upload it via the Play Console, fill in the store listing, privacy policy
   (required — even a simple one, since you request call/SMS permissions),
   and submit for review (usually a few days).

Until then, sharing the `.apk` link directly (from step 4 above) is the
fastest way to let friends install it.
