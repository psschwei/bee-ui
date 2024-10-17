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

import { BaseFetchOptions, client } from '../client';
import { assertSuccessResponse, getRequestHeaders } from '../utils';
import {
  ProjectUserCreateBody,
  ProjectUserRole,
  ProjectUsersListQuery,
} from './types';

export async function readProjectUser(projectId: string, id: string) {
  const res = await client.GET(
    '/v1/organization/projects/{project_id}/users/{user_id}',
    {
      params: { path: { project_id: projectId, user_id: id } },
      headers: getRequestHeaders(projectId),
    },
  );

  assertSuccessResponse(res);
  return res.data;
}

export async function listProjectUsers(
  projectId: string,
  query: ProjectUsersListQuery,
) {
  const res = await client.GET('/v1/organization/projects/{project_id}/users', {
    params: {
      path: { project_id: projectId },
      query,
    },
    headers: getRequestHeaders(projectId),
  });
  assertSuccessResponse(res);
  return res.data;
}

export async function createProjectUser(
  projectId: string,
  body: ProjectUserCreateBody,
) {
  const res = await client.POST(
    '/v1/organization/projects/{project_id}/users',
    {
      params: { path: { project_id: projectId } },
      body,
      headers: getRequestHeaders(projectId),
    },
  );
  assertSuccessResponse(res);
  return res.data;
}

export async function deleteProjectUser(projectId: string, userId: string) {
  const res = await client.DELETE(
    '/v1/organization/projects/{project_id}/users/{user_id}',
    {
      params: { path: { project_id: projectId, user_id: userId } },
      headers: getRequestHeaders(projectId),
    },
  );
  assertSuccessResponse(res);
  return res.data;
}

export async function updateProjectUser(
  projectId: string,
  userId: string,
  role: ProjectUserRole,
) {
  const res = await client.POST(
    '/v1/organization/projects/{project_id}/users/{user_id}',
    {
      params: { path: { project_id: projectId, user_id: userId } },
      body: { role },
      headers: getRequestHeaders(projectId),
    },
  );
  assertSuccessResponse(res);
  return res.data;
}