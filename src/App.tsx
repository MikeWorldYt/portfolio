import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout.tsx'
import { Contact } from './routes/Contact.tsx'
import { Home } from './routes/Home.tsx'
import { NotFound } from './routes/NotFound.tsx'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
