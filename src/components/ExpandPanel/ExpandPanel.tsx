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

import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import classes from './ExpandPanel.module.scss';

interface Props {
  id: string;
  triggerId: string;
  expanded: boolean;
  closeImmediately?: boolean;
  onFocus: () => void;
  className?: string;
}

export function ExpandPanel({
  id,
  triggerId,
  expanded,
  closeImmediately,
  onFocus,
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={triggerId}
      className={clsx(classes.root, className, {
        [classes.expanded]: expanded,
        [classes.closeImmediately]: closeImmediately,
      })}
      onFocus={onFocus}
    >
      <div className={classes.content}>{children}</div>
    </div>
  );
}