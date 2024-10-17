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

import classes from './ReadOnlyTooltipContent.module.scss';
import { useModal } from '@/layout/providers/ModalProvider';
import pluralize from 'pluralize';
import { CreateProjectModal } from './manage/CreateProjectModal';

interface Props {
  entityName: string;
}

export function ReadOnlyTooltipContent({ entityName }: Props) {
  const { openModal } = useModal();
  return (
    <div className={classes.content}>
      You have view-only permissions to this workspace and cannot create{' '}
      {pluralize(entityName, 2)}. Switch to another workspace or{' '}
      <span
        role="button"
        className={classes.button}
        onClick={() => openModal((props) => <CreateProjectModal {...props} />)}
      >
        create a new one
      </span>
    </div>
  );
}