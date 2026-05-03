'use client';

import {
  QueryClientProvider as Provider,
  QueryClientProviderProps as ProviderProps,
  QueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export type QueryClientProviderProps = Omit<ProviderProps, 'client'> & {};

export default function QueryClientProvider({ children, ...props }: QueryClientProviderProps) {
  return (
    <Provider client={queryClient} {...props}>
      {children}
    </Provider>
  );
}
