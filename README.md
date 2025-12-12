
## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Testing on Mobile Devices (Android & iPhone)

To test the app on real Android and iPhone devices, you can do it by Local Network access:

1. **Start the dev server with network access:**
   ```bash
   npm run dev:mobile
   # or
   yarn dev:mobile
   ```

2. **Find your local IP address:**
   - **macOS/Linux:** Run `ifconfig | grep "inet " | grep -v 127.0.0.1` or `ipconfig getifaddr en0`
   - **Windows:** Run `ipconfig` and look for IPv4 Address

3. **Connect your mobile device:**
   - Ensure your phone/tablet is on the **same Wi-Fi network** as your computer
   - Open a browser on your device and navigate to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

4. **Test device detection:**
   - The app automatically detects Android/iOS devices via user-agent headers
   - You should see "Download for Android" on Android devices
   - You should see "Download for iPhone" on iOS devices

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Vercel](https://vercel.com/) for deployment

## 📚 Learn More

To dive deeper into Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## 📄 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
