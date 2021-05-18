import React, { MutableRefObject } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface CustomEditorProps {
  contentReference: MutableRefObject<string>,
  height: number,
}

const CustomEditor = ({ contentReference, height }: CustomEditorProps): JSX.Element => {
  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_MCE_KEY}
      initialValue={contentReference.current}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist autolink lists link image',
          'charmap print preview anchor help',
          'searchreplace visualblocks code',
          'insertdatetime media table paste wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | image link | bullist numlist outdent indent | help'
      }}
    onEditorChange={(editorContent: string) => contentReference.current = editorContent}
    />
  );
}

export default CustomEditor;
