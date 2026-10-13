import { BrowserRouter, Route, Routes } from 'react-router'
import { Contact } from './routes/Contact.tsx'
import { Home } from './routes/Home.tsx'
import { NotFound } from './routes/NotFound.tsx'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
