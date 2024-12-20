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
import { AdminView } from '@/components/AdminView/AdminView';
import { HomeSection, ProjectHome } from '../projects/ProjectHome';
import { ToolsList } from './ToolsList';

export function ToolsHome() {
  return (
    <ProjectHome section={HomeSection.Tools}>
      <ToolsList type="user" />
    </ProjectHome>
  );
}

export function PublicToolsHome() {
  return (
    <AdminView title="Public tools">
      <ToolsList type="public" />
    </AdminView>
  );
}
