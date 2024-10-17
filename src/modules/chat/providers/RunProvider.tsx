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
import { ThreadRun } from '@/app/api/threads-runs/types';
import { createContext, PropsWithChildren, use, useMemo } from 'react';

export interface RunContextValue {
  run?: ThreadRun;
}

const RunContext = createContext<RunContextValue>(
  null as unknown as RunContextValue,
);

interface Props {
  run?: ThreadRun;
}

export function RunProvider({ run, children }: PropsWithChildren<Props>) {
  const contextValue = useMemo(
    () => ({
      run,
    }),
    [run],
  );

  return (
    <RunContext.Provider value={contextValue}>{children}</RunContext.Provider>
  );
}

export function useRunContext() {
  const context = use(RunContext);

  if (!context) {
    throw new Error('useRunContext must be used within a RunProvider');
  }

  return context;
}