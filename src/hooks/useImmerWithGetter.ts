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

import { useMemo } from 'react';
import { Draft, produce, freeze } from 'immer';
import { useStateWithGetter } from './useStateWithGetter';

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;

export function useImmerWithGetter<S>(initialValue: S): [() => S, Updater<S>] {
  const [get, set] = useStateWithGetter(freeze(initialValue));

  return useMemo(
    () => [
      get,
      (updater: S | DraftFunction<S>) => {
        if (typeof updater === 'function') {
          set(produce(updater as DraftFunction<S>));
        } else {
          set(freeze(updater));
        }
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}