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

import { useRef } from 'react';

interface Props {
  durationStart: number;
  increaseStep: number;
  countWithoutIncrease?: number;
}

export function useGetLinearIncreaseDuration({
  durationStart,
  increaseStep,
  countWithoutIncrease = 0,
}: Props) {
  const refetchCountRef = useRef<number>(0);

  const onReset = () => {
    refetchCountRef.current = 0;
  };

  const getDuration = () => {
    refetchCountRef.current += 1;

    return (
      durationStart +
      (refetchCountRef.current > countWithoutIncrease
        ? (refetchCountRef.current - countWithoutIncrease) * increaseStep
        : 0)
    );
  };

  return { onResetDuration: onReset, getDuration };
}