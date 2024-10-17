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

import { TextAreaAutoHeight } from '@/components/TextAreaAutoHeight/TextAreaAutoHeight';
import { FormLabel } from '@carbon/react';
import classes from './StarterQuestionsTextArea.module.scss';

export function StarterQuestionsTextArea() {
  return (
    <div className={classes.root}>
      <FormLabel>Starter questions</FormLabel>

      <TextAreaAutoHeight
        className={classes.textarea}
        placeholder="Type and add a question that users can select at the start of a new session"
        rows={1}
      />
    </div>
  );
}