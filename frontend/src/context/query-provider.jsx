import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient outside component to avoid React 19 compatibility issues
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache data for 10 minutes - good for movie data that doesn't change often
            staleTime: 1000 * 60 * 10, // 10 minutes
            // Keep data in cache for 30 minutes even when component unmounts
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            // Retry failed requests up to 3 times with exponential backoff
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors (client errors)
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Retry up to 3 times for other errors
                return failureCount < 3;
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for better UX (but not too aggressive)
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect by default (can be overridden per query)
            refetchOnReconnect: 'always',
            // Refetch on mount if data is stale
            refetchOnMount: 'stale',
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
            // Retry delay for mutations
            retryDelay: 1000,
        },
    },
});

export default function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
