/**
 * Copyright 2024 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { useHandleError } from '../hooks/useHandleError';

interface QueryMetadata extends Record<string, unknown> {
  errorToast?: false | { title?: string; includeErrorMessage?: boolean };
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: QueryMetadata;
    mutationMeta: QueryMetadata;
  }
}

function makeQueryClient(
  config: Omit<QueryClientConfig, 'defaultOptions'> = {},
) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
    ...config,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(handleError: HandleErrorFn) {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient({
      queryCache: getQueryCache(handleError),
      mutationCache: getMutationCache(handleError),
    });
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient)
      browserQueryClient = makeQueryClient({
        queryCache: getQueryCache(handleError),
        mutationCache: getMutationCache(handleError),
      });
    return browserQueryClient;
  }
}

type HandleErrorFn = ReturnType<typeof useHandleError>;

function getQueryCache(handleError: HandleErrorFn) {
  return new QueryCache({
    onError(error, query) {
      handleError(error, {
        toast: query.meta?.errorToast,
      });
    },
  });
}

function getMutationCache(handleError: HandleErrorFn) {
  return new MutationCache({
    onError(error, variables, context, mutation) {
      handleError(error, {
        toast: mutation.meta?.errorToast,
      });
    },
  });
}

export function QueryProvider({ children }: PropsWithChildren) {
  const handleError = useHandleError();
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient(handleError);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}