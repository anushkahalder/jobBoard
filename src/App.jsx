import { useState } from 'react'
 
import './App.css'
import OptimisedJob from './components/OptimisedJob'

function App() {
  const [count, setCount] = useState(0)

  return (
 <>
 <OptimisedJob/>
 </>
  )
}

export default App
