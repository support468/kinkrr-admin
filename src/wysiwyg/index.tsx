import { useState } from 'react';
import SunEditor from 'suneditor-react';
import {
  image, font, fontColor, fontSize, formatBlock, blockquote, hiliteColor,
  align, lineHeight, list, table, video, link
} from 'suneditor/src/plugins';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { settingService } from '@services/setting.service';

interface IProps {
  placeholder?: string;
  onChange: Function;
  content?: string;
}

function WYSISWYG({ placeholder, onChange, content }: IProps) {
  const [editorState, setEditorState] = useState<string>(content);
  const onEditorStateChange = (v: string) => {
    setEditorState(v);
    onChange && onChange(v);
  };

  const uploadPhoto = (files: File[], info: object, uploadHandler: any): boolean => {
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);
    settingService.uploadFile(formData).then((resp) => uploadHandler({
      result: [{
        url: resp.data.url,
        name: resp.data.name
      }]
    }));
    return false; // Prevent default upload, as we handle it manually
  };

  return (
    <SunEditor
      lang="en"
      onChange={onEditorStateChange}
      setContents={editorState}
      placeholder={placeholder}
      autoFocus={false}
      setOptions={{
        mode: 'classic',
        height: '250',
        buttonList: [
          [
            'undo',
            'redo',
            'font',
            'fontSize',
            'formatBlock',
            'blockquote',
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',
            'fontColor',
            'hiliteColor',
            'removeFormat',
            'align',
            'lineHeight',
            'list',
            'link',
            'table',
            'image',
            'video',
            'fullScreen',
            'preview'
          ]
        ],
        plugins: [
          image,
          font,
          fontColor,
          fontSize,
          formatBlock,
          blockquote,
          hiliteColor,
          align,
          lineHeight,
          list,
          table,
          video,
          link
        ]
      }}
      onImageUploadBefore={uploadPhoto}
    />
  );
}

WYSISWYG.defaultProps = {
  placeholder: 'Description..',
  content: ''
};

export default WYSISWYG;
