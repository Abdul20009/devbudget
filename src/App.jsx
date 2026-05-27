import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Calculator from './pages/Calculator'
import Results from './pages/Results'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}
