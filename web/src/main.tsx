import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { initPreventPinchZoom } from '@/lib/prevent-pinch-zoom'
import { preloadAppImages } from '@/lib/preload-images'

initPreventPinchZoom()
void preloadAppImages()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
