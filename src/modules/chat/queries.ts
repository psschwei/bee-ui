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

import { fetchLinkPreview } from '@/app/api/link-preview';
import {
  listMessages,
  listMessagesWithFiles,
} from '@/app/api/threads-messages';
import { MessagesListQuery } from '@/app/api/threads-messages/types';
import {
  listRuns,
  listRunSteps,
  readRun,
  readTrace,
} from '@/app/api/threads-runs';
import { RunsListQuery, RunStepsQuery } from '@/app/api/threads-runs/types';
import { queryOptions } from '@tanstack/react-query';

export const listMessagesQuery = (
  projectId: string,
  threadId: string,
  query?: MessagesListQuery,
) =>
  queryOptions({
    queryKey: ['threads.messages', projectId, threadId, query],
    queryFn: () => listMessages(projectId, threadId, query),
    staleTime: 60 * 60 * 1000,
  });

export const runsQuery = (
  projectId: string,
  threadId: string,
  query?: RunsListQuery,
) =>
  queryOptions({
    queryKey: ['runs', projectId, threadId, query?.order, query?.order_by],
    queryFn: () => listRuns(projectId, threadId, query),
    meta: {
      errorToast: false,
    },
  });

export const linkPreviewQuery = (url: string) =>
  queryOptions({
    queryKey: ['linkPreview', url],
    queryFn: () => fetchLinkPreview(url),
  });

export const messagesWithFilesQuery = (
  projectId: string,
  threadId: string,
  query?: MessagesListQuery,
) =>
  queryOptions({
    queryKey: ['messages', projectId, threadId],
    queryFn: () => listMessagesWithFiles(projectId, threadId, query),
  });

export const readRunQuery = (
  projectId: string,
  threadId: string,
  runId: string,
) =>
  queryOptions({
    queryKey: ['run', projectId, threadId, runId],
    queryFn: () => readRun(projectId, threadId, runId),
    meta: {
      errorToast: false,
    },
  });

export const runStepsQuery = (
  projectId: string,
  threadId: string,
  runId: string,
  query?: RunStepsQuery,
) => {
  const order = query?.order ?? 'asc';

  return queryOptions({
    queryKey: [
      'steps',
      projectId,
      threadId,
      runId,
      order,
      query?.order_by,
      query?.limit,
    ],
    queryFn: () =>
      listRunSteps(projectId, threadId, runId, {
        ...query,
        order,
      }),
    staleTime: 24 * 60 * 60 * 1000, // 1 day
    meta: {
      errorToast: {
        title: 'Failed to load steps for the message.',
        includeErrorMessage: true,
      },
    },
  });
};

export const readRunTraceQuery = (
  projectId: string,
  threadId: string,
  runId: string,
) =>
  queryOptions({
    queryKey: ['run-trace', projectId, threadId, runId],
    queryFn: () => readTrace(projectId, threadId, runId),
    meta: {
      errorToast: false,
    },
  });