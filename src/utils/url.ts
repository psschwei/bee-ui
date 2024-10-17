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

// https://stackoverflow.com/a/19709846
const ABSOLUTE_URL_REGEX = new RegExp('^(?:[a-z+]+:)?//', 'i');
export const isAbsoluteUrl = (url: string) => ABSOLUTE_URL_REGEX.test(url);

export function maybeParseUrl(url: string) {
  try {
    return new URL(url, 'http://base');
  } catch {
    return;
  }
}