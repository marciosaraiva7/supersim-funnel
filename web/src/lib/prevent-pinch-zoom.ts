const GESTURE_EVENTS = ['gesturestart', 'gesturechange', 'gestureend'] as const

const listenerOptions: AddEventListenerOptions = { passive: false }

function preventMultiTouchZoom(event: TouchEvent) {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}

function preventGesture(event: Event) {
  event.preventDefault()
}

function preventWheelZoom(event: WheelEvent) {
  if (event.ctrlKey) {
    event.preventDefault()
  }
}

/** Bloqueia zoom por gesto de pinça e trackpad em todo o app. */
export function initPreventPinchZoom() {
  document.addEventListener('touchmove', preventMultiTouchZoom, listenerOptions)
  document.addEventListener('wheel', preventWheelZoom, listenerOptions)

  for (const type of GESTURE_EVENTS) {
    document.addEventListener(type, preventGesture, listenerOptions)
  }
}
