import { Route, Routes } from 'react-router-dom';

import { Header } from '@/components/Header';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { ComparePage } from '@/pages/ComparePage';

export default function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </main>
    </>
  );
}
