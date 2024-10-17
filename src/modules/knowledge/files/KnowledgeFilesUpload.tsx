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

import { CloudUpload } from '@carbon/react/icons';
import classes from './KnowledgeFilesUpload.module.scss';
import { useDropzone, ErrorCode, FileRejection } from 'react-dropzone';
import { Dispatch, SetStateAction, SyntheticEvent, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import mimeType from 'mime-types';
import clsx from 'clsx';
import { FileUploaderItem } from '@carbon/react';
import { useToast } from '@/layout/providers/ToastProvider';
import { VectoreStoreFileUpload } from './VectorStoreFilesUploadProvider';
import { FeatureName, isFeatureEnabled } from '@/utils/isFeatureEnabled';

interface Props {
  files: VectoreStoreFileUpload[];
  onSetFiles: Dispatch<SetStateAction<VectoreStoreFileUpload[]>>;
  disabled?: boolean;
}

export function KnowledgeFilesUpload({ files, disabled, onSetFiles }: Props) {
  const { addToast } = useToast();

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: uuid(),
        originalFile: file,
        status: 'new' as const,
        isReadable: true,
      }));

      onSetFiles((files) => [...files, ...newFiles]);
    },
    [onSetFiles],
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      rejections.forEach(({ errors, file }) => {
        addToast({
          title: `File '${file.name}' was rejected`,
          subtitle: errors.map(({ message }) => message).join('\n'),
          timeout: 5_000,
        });
      });
    },
    [addToast],
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: DROPZONE_ALLOWED_MIME_TYPES,
    validator: (file) => {
      if (file.size > MAX_SIZE)
        return { message: 'File is too big.', code: ErrorCode.FileTooLarge };
      return null;
    },
  });

  return (
    <div className={classes.root}>
      <label className={classes.label}>Documents</label>
      <div
        className={clsx(classes.dropzone, {
          [classes.dragging]: isDragActive,
          [classes.disabled]: disabled,
        })}
        {...getRootProps()}
      >
        <div className={classes.content}>
          <span className={classes.icon}>
            <CloudUpload size={32} />
          </span>

          <p>
            Drag & drop or <a role="button">attach files</a>
          </p>

          <p className={classes.description}>
            Supports files up to {HUMAN_MAX_SIZE}. Accepted formats: text (
            {HUMAN_ALLOWED_EXTENSIONS_TEXT})
            {isFeatureEnabled(FeatureName.TextExtraction)
              ? ` and other files containing text (
            ${HUMAN_ALLOWED_EXTENSIONS_EXTRACTION})`
              : ''}
            .
          </p>
        </div>
      </div>

      <div className={classes.files}>
        {files.map((file) => (
          <UploadFileItem
            key={file.id}
            value={file}
            onDelete={() => {
              onSetFiles((files) =>
                files.filter((item) => file.id !== item.id),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}

// MAX_SIZE representation for humans
export const HUMAN_MAX_SIZE = '100 MiB';
const MAX_SIZE = 100 * 1024 * 1024;
export const ALLOWED_EXTENSIONS_TEXT = ['txt', 'md', 'html'];
export const ALLOWED_EXTENSIONS_EXTRACTION = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'tiff',
  'bmp',
  'gif',
];
export const ALLOWED_EXTENSIONS = [
  ...ALLOWED_EXTENSIONS_TEXT,
  ...(isFeatureEnabled(FeatureName.TextExtraction)
    ? ALLOWED_EXTENSIONS_EXTRACTION
    : []),
];
export const ALLOWED_MIME_TYPES = ALLOWED_EXTENSIONS.map((ext) =>
  String(mimeType.lookup(ext)),
);
const DROPZONE_ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES.reduce(
  (result: { [key: string]: [] }, type) => {
    result[type] = [];
    return result;
  },
  {},
);

function getExtensionsReadable(extensions: string[]) {
  return extensions.map((extension) => `.${extension}`).join(', ');
}
export const HUMAN_ALLOWED_EXTENSIONS_TEXT = getExtensionsReadable(
  ALLOWED_EXTENSIONS_TEXT,
);
export const HUMAN_ALLOWED_EXTENSIONS_EXTRACTION = getExtensionsReadable(
  ALLOWED_EXTENSIONS_EXTRACTION,
);

interface UploadFileItemProps {
  value: VectoreStoreFileUpload;
  onDelete: (fileId: string) => void;
}

function UploadFileItem({ value, onDelete }: UploadFileItemProps) {
  const { id, status, originalFile } = value;
  const isPending = status === 'embedding' || status === 'uploading';

  let iconDescription = 'Remove file';
  if (value.status === 'uploading') {
    iconDescription = 'Uploading...';
  } else if (status === 'embedding') {
    iconDescription = 'Embedding...';
  } else if (status === 'complete') {
    iconDescription = 'Completed';
  }

  return (
    <FileUploaderItem
      name={originalFile.name}
      uuid={id}
      iconDescription={iconDescription}
      status={
        isPending ? 'uploading' : status === 'complete' ? 'complete' : 'edit'
      }
      onDelete={(
        _e: SyntheticEvent<HTMLElement, Event>,
        { uuid }: { uuid: string },
      ) => {
        onDelete(uuid);
      }}
    />
  );
}