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

import { AssistantResult } from '@/app/api/assistants/types';
import { decodeMetadata } from '@/app/api/utils';
import { simpleHashInRange } from '@/utils/helpers';
import { has } from 'lodash';
import { StarterQuestion } from './builder/AssistantBuilderProvider';
import {
  ASSISTANT_ICONS,
  AssitantIconName,
  getAssistantIcons,
} from './icons/AssistantBaseIcon';
import {
  Assistant,
  AssistantMetadata,
  STARTER_QUESTION_KEY_PREFIX,
  StarterQuestionsMetadata,
} from './types';

export function getAssistantFromAssistantResult(
  data: AssistantResult,
): Assistant {
  return {
    ...data,
    metadata: decodeMetadata<AssistantMetadata>(data?.metadata),
  };
}

export function encodeStarterQuestionsMetadata(
  questions: StarterQuestion[] = [],
): StarterQuestionsMetadata {
  return questions.reduce((starterQuestions, { id, question }) => {
    if (question !== '') {
      starterQuestions[`${STARTER_QUESTION_KEY_PREFIX}${id}`] = question;
    }
    return starterQuestions;
  }, {} as StarterQuestionsMetadata);
}

export function decodeStarterQuestionsMetadata(
  metadata: StarterQuestionsMetadata = {},
): StarterQuestion[] {
  return Object.entries(metadata).reduce((starterQuestions, [key, value]) => {
    if (key.startsWith(STARTER_QUESTION_KEY_PREFIX)) {
      starterQuestions.push({
        id: key.replace(STARTER_QUESTION_KEY_PREFIX, ''),
        question: value,
      });
    }

    return starterQuestions;
  }, [] as StarterQuestion[]);
}

const iconsMap = new Map<string, AssitantIconName>();

export function getAssistantIconName(
  assistant: Assistant | null,
): AssitantIconName | undefined {
  const iconName = assistant?.metadata.icon;

  if (iconName) {
    if (iconsMap.has(iconName)) {
      return iconsMap.get(iconName);
    }

    if (!has(ASSISTANT_ICONS, iconName)) {
      const assistantIcons = getAssistantIcons();
      const randomIndex = simpleHashInRange(
        iconName,
        0,
        assistantIcons.length - 1,
      );

      const newIconName = assistantIcons[randomIndex][0] as AssitantIconName;

      iconsMap.set(iconName, newIconName);

      return newIconName;
    }
  }

  return iconName;
}
