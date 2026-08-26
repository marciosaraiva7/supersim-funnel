import { BrowserRouter } from 'react-router-dom'
import { FlowProvider } from '@/context/FlowContext'
import { AppRoutes } from '@/app/routes'

export function App() {
  return (
    <FlowProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FlowProvider>
  )
}
