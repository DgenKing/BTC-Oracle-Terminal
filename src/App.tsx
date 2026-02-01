import { Terminal } from './components/terminal/Terminal';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Terminal />
      <Analytics />
    </>
  )
}

export default App