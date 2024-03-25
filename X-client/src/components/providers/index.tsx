'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function Providers({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
       {children}
    </QueryClientProvider>
  )
}

export default Providers