# Tunify 🎵

**Tunify** is a decentralized music streaming platform that integrates blockchain technology to enable seamless payments and subscriptions. Built with **Next.js**, **Privy**, and **Ethereum**, Tunify allows users to pay for streaming minutes using cryptocurrency, create playlists, and manage their music library.

---

## Features ✨

- **Blockchain Payments**: Pay for streaming minutes using Ethereum (ETH).
- **Decentralized Wallet Integration**: Securely connect your wallet using **Privy**.
- **Playlist Management**: Create, save, and manage playlists.
- **Search and Explore**: Discover new music and add tracks to your library.
- **Balance Tracking**: View your ETH balance and transaction history.
- **User Authentication**: Log in and log out using your wallet.

---

## Tech Stack 🛠️

- **Frontend**: Next.js, Tailwind CSS, Shadcn UI
- **Authentication**: Privy
- **Blockchain**: Ethereum (via Privy's `useSendTransaction`)
- **Backend**: Node.js,Foundry (for balance and wallet address APIs)
- **Icons**: Lucide React Icons

---

## Getting Started 🚀

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Ethereum wallet (e.g., MetaMask)
- Privy API key (sign up at [Privy](https://privy.io/))

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/philotheephilix/tunify.git
   cd tunify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
   NEXT_PUBLIC_MASTER_WALLET_ADDRESS=your-master-wallet-address
   NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/your-infura-project-id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**:
   Visit `http://localhost:3000` to see the app in action.

---

## Project Structure 📂

```
tunify/
├── app/                  # Next.js app directory
│   ├── api/              # API routes (e.g., getBalance, getMasterWallet)
│   ├── components/       # Reusable components (e.g., Sidebar, SearchWindow)
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── public/               # Static assets
├── styles/               # Global styles
├── hooks/                # Custom hooks (e.g., useAudioPlayer)
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

---

## Usage 🎧

### 1. **Connect Your Wallet**
   - Click the **Log In** button to connect your Ethereum wallet using Privy.
   - Once connected, your wallet address will be displayed in the sidebar.

### 2. **Add Streaming Minutes**
   - Click the **Transfer** button in the sidebar.
   - Enter the amount of ETH you want to deposit (minimum 0.002 ETH).
   - Confirm the transaction in your wallet.

### 3. **Create Playlists**
   - Click **Create Playlist** in the sidebar.
   - Enter a name for your playlist and add tracks using the search feature.

### 4. **Explore Music**
   - Use the **Search** feature to find new tracks.
   - Add tracks to your library or playlists.

### 5. **View Your Library**
   - Navigate to **Your Library** to see your saved tracks and playlists.

---

## Contribution
### Covalent Ai Agent SDK
#### Pull Request 1 (HF Spaces inference Integration)
- Hugging face provides easy model switching capacity and latest models gets hosted there
- Cheaper and flexible for advanced user
- Allows many users to integrate Covalent API due to inclusion of extensive features
- No other Web3 Frameworks doesn't have HF inference support

#### Pull Request 2 (Python Gradio Plugin integration)
- Gradio Library is used for API cum UI layouting for rapid prototyping of ML models
- Widely used by custom models running in python 
- Very flexible to the level of python flexibility
#### Links:
- [Gradio Plugin Integration](https://github.com/covalenthq/ai-agent-sdk/pull/75)
- [HF inference](https://github.com/covalenthq/ai-agent-sdk/pull/74)

## API Endpoints 🌐

### 1. **Get Master Wallet Address**
   - **Endpoint**: `/api/getMasterWallet`
   - **Method**: `GET`
   - **Response**:
     ```json
     {
       "address": "0xYourMasterWalletAddress"
     }
     ```

### 2. **Get User Balance**
   - **Endpoint**: `/api/getBalance`
   - **Method**: `GET`
   - **Query Parameter**: `address` (user's wallet address)
   - **Response**:
     ```json
     {
       "balance": "0.005"
     }
     ```

---

## Contributing 🤝

We welcome contributions! Here's how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License 📜

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments 🙏

- **Privy** for seamless wallet integration.
- **Next.js** for the powerful React framework.
- **Tailwind CSS** for utility-first styling.
- **Shadcn UI** for beautiful, accessible components.

---

## Contact 📧

For questions or feedback, reach out to us at [philosanjay5@gmail.com](mailto:philosanjay5@gmail.com).

