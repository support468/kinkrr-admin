/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { DeleteOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  Progress, Button, Upload, Tooltip, Image, Modal
} from 'antd';
import { VideoPlayer } from '@components/common';
import style from './list-media.module.scss';

interface IProps {
  remove: Function;
  files: any[];
  onAddMore: Function;
  uploading: boolean;
  type: string;
}
export default function UploadList({
  files, remove, uploading, type, onAddMore
}: IProps) {
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');

  return (
    <div className={style['f-upload-list']}>
      {files && files.map((file) => (
        <div className={style['f-upload-item']} key={file._id || file.uid}>
          <div className={style['f-upload-thumb']}>
            {(file.type.includes('feed-photo') || file.type.includes('image'))
              ? <a><Image fallback="/heic-warning.webp" alt="img" src={file?.url || file?.thumbnail} width="100%" /></a>
              : file.type.includes('video') ? (
                <a aria-hidden onClick={() => setPreviewVideoUrl(file?.url)}>
                  <span className={style['f-thumb-vid']}>
                    <PlayCircleOutlined />
                  </span>
                </a>
              ) : <a href={file.url} target="_blank" rel="noreferrer"><img alt="img" src="/placeholder-image.jpg" width="100%" /></a>}
          </div>
          <div className={style['f-upload-name']}>
            <Tooltip title={file.name}>{file.name}</Tooltip>
          </div>
          <div className={style['f-upload-size']}>
            {(file.size / (1024 * 1024)).toFixed(2)}
            {' '}
            MB
          </div>
          {file.status !== 'uploading'
            && (
              <span className={style['f-remove']}>
                <Button type="primary" onClick={() => remove(file)}>
                  <DeleteOutlined />
                </Button>
              </span>
            )}
          {file.percent && <Progress percent={Math.round(file.percent)} />}
        </div>
      ))}
      {(type === 'photo' || (type === 'video' && !files.length)) && (
        <div className={style['add-more']}>
          <Upload
            customRequest={() => true}
            accept={type === 'video' ? 'video/*' : 'image/*,.heic,.heif'}
            beforeUpload={onAddMore.bind(this)}
            multiple={type === 'photo'}
            showUploadList={false}
            disabled={uploading}
            listType="picture"
          >
            <PlusOutlined />
            {' '}
            {type === 'photo' ? 'photos' : type === 'video' ? 'video' : 'files'}
          </Upload>
        </div>
      )}

      {previewVideoUrl && (
        <Modal
          width={767}
          footer={null}
          onCancel={() => setPreviewVideoUrl('')}
          open={!!previewVideoUrl}
          destroyOnClose
        >
          <VideoPlayer
            {...{
              autoplay: true,
              controls: true,
              playsinline: true,
              fluid: true,
              sources: [
                {
                  src: previewVideoUrl,
                  type: 'video/mp4'
                }
              ]
            }}
          />
        </Modal>
      )}
    </div>
  );
}
