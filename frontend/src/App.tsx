import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';

const App = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    const message = `Login to Decentralized App\nAddress: ${address}\nTimestamp: ${Date.now()}`;
    try {
      const signature = await signMessageAsync({ message });

      const res = await fetch('http://localhost:4000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await res.json();
      setToken(data.token);
      console.log('✅ Auth Token:', data.token);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🦄 RainbowKit Login</h2>
      <ConnectButton />
      {isConnected && (
        <button onClick={handleLogin} style={{ marginTop: 20 }}>
          Login with Wallet
        </button>
      )}
      {token && (
        <p>
          Logged in! Token: <code>{token}</code>
        </p>
      )}
    </div>
  );
};

export default App;
