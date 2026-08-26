import { useEffect } from 'react'

export function useBackRedirect(redirectPath: string) {
  useEffect(() => {
    const search = window.location.search
    const dest =
      redirectPath + (search ? (redirectPath.includes('?') ? '&' : '?') + search.slice(1) : '')

    history.pushState({}, '', location.href)
    history.pushState({}, '', location.href)
    history.pushState({}, '', location.href)

    const onPopState = () => {
      setTimeout(() => {
        window.location.href = dest
      }, 1)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [redirectPath])
}
