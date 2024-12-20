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

import {
  Thread,
  ThreadCreateBody,
  ThreadsListResponse,
  ThreadUpdateBody,
} from '@/app/api/threads/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createThread, deleteThread, updateThread } from '@/app/api/threads';
import { threadQuery, threadsQuery } from '../history/queries';
import { useAppContext } from '@/layout/providers/AppProvider';
import { produce } from 'immer';

export function useThreadApi(thread: Thread | null) {
  const queryClient = useQueryClient();
  const { project } = useAppContext();

  const updateMutation = useMutation({
    mutationFn: (body: ThreadUpdateBody) =>
      updateThread(project.id, thread?.id ?? '', body),
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<ThreadsListResponse>>(
        threadsQuery(project.id).queryKey,
        produce((draft) => {
          if (!draft?.pages) return null;
          for (const page of draft.pages) {
            const index = page.data.findIndex((item) => item.id === thread?.id);

            if (index >= 0 && data) {
              page?.data.splice(index, 1, data);
            }
          }
        }),
      );

      queryClient.invalidateQueries({
        queryKey: threadsQuery(project.id).queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: threadQuery(project.id, thread?.id ?? '').queryKey,
      });
    },
    meta: {
      errorToast: {
        title: 'Failed to update session',
        includeErrorMessage: true,
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: (body: ThreadCreateBody) => createThread(project.id, body),
    meta: {
      errorToast: {
        title: 'Failed to create session',
        includeErrorMessage: true,
      },
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteThread(project.id, id),
    meta: {
      errorToast: false,
    },
  });

  return {
    updateMutation,
    createMutation,
    deleteMutation,
  };
}
