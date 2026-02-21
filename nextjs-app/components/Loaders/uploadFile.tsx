"use client"

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadFileProps {
  onFileChange: (file: File) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
        const uploaded_file = acceptedFiles[0];
        onFileChange(uploaded_file);
        setFileName(uploaded_file.name);
      }
  }, [onFileChange])

  const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
      accept: {
        'application/octet-stream': ['.doc', '.docx'],
      },
      onDrop});

  return (
    <div {...getRootProps({ className: 'dropzone', role: 'button' })} className='border-2 border-dashed border-primary p-5 text-center w-full overflow-scroll'>
    <input {...getInputProps()} className='w-full'/>
    {isDragActive ? (
        <p className='text-start'>Перетащите файл сюда ...</p>
      ) : fileRejections.length > 0 ? (
        <div>
          <p className="text-red-500">Ошибка:</p>
          <ul>
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - файл должен иметь тип .doc
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-start'>
          {fileName ? `${fileName} ` : 'Выберите файл или перетащите'}
        </p>
      )}
  </div>
  );
};

export default UploadFile;