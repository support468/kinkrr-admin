'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Form, Input, Select, Upload, Button, Progress, Switch, DatePicker,
  Col, Row, InputNumber, Avatar, Modal,
  message
} from 'antd';
import { CameraOutlined, VideoCameraAddOutlined, FileAddOutlined } from '@ant-design/icons';
import { IVideo } from 'src/interfaces';
import SelectPerformerDropdown from '@components/performer/common/select-performer-dropdown';
import { performerService, videoService } from '@services/index';
import { FormInstance } from 'antd/lib/form';
import { debounce } from 'lodash';
import { dayjsx } from '@lib/dayjs';
import { VideoPlayer } from '@components/common';
import { useRouter } from 'next/router';
import { showError } from '@lib/message';

type P = {
  video?: IVideo;
};

interface IFiles {
  fieldname: string;
  file: File;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export default function VideoFormUpload({ video = null }: P) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    teaser: null
  });
  const [isSale, setIsSale] = useState(video?.isSale || false);
  const [isSchedule, setIsSchedule] = useState(video?.isSchedule || false);
  const [scheduledAt, setScheduledAt] = useState((video?.scheduledAt && dayjsx(video.scheduledAt)) || dayjsx().add(1, 'day'));
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedTeaser, setSelectedTeaser] = useState(null);
  const [firstLoadPerformer, setFirstLoadPerformer] = useState(false);
  const [performers, setPerformers] = useState([]);
  const [removedTeaser, setRemovedTeaser] = useState(false);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const formRef = useRef<any>(null);
  const router = useRouter();

  const previewThumbnail = video?.thumbnail || null;
  const previewVideo = video?.video || null;
  const previewTeaserVideo = video?.teaser || null;

  const getPerformers = debounce(async (q, performerIds) => {
    try {
      const resp = await (await performerService.search({ q, includedIds: performerIds || '', limit: 99 })).data;
      setPerformers(resp.data || []);
      setFirstLoadPerformer(true);
    } catch (e) {
      showError(e);
    }
  }, 500);

  useEffect(() => {
    getPerformers('', video?.participantIds || '');
  }, []);

  const handleRemoveFile = async (type: string) => {
    if (!window.confirm('Confirm to remove file!')) return;
    try {
      await videoService.deleteFile(video._id, type);
      type === 'teaser' && setRemovedTeaser(true);
      type === 'thumbnail' && setRemovedThumbnail(true);
    } catch (e) {
      showError(e);
    }
  };

  const setFormVal = (field: string, val: any) => {
    const instance = formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  };

  const beforeUploadHandler = (file: File, field: string) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: file
    }));
  };

  const beforeUpload = (file: File, field: string) => {
    let maxSize = Number(process.env.MAX_SIZE_FILE) || 100;
    switch (field) {
      case 'thumbnail':
        maxSize = Number(process.env.MAX_SIZE_IMAGE) || 5;
        break;
      case 'teaser': maxSize = Number(process.env.MAX_SIZE_TEASER) || 200;
        break;
      case 'video': maxSize = Number(process.env.MAX_SIZE_VIDEO) || 2048;
        break;
      default: break;
    }
    const valid = file.size / 1024 / 1024 < maxSize;
    if (!valid) {
      // eslint-disable-next-line no-nested-ternary
      showError(`${field === 'thumbnail' ? 'Thumbnail' : field === 'teaser' ? 'Teaser' : 'Video'} must be smaller than ${maxSize}MB!`);
      return false;
    }
    if (field === 'thumbnail') setSelectedThumbnail(file);
    if (field === 'teaser') setSelectedTeaser(file);
    if (field === 'video') setSelectedVideo(file);
    beforeUploadHandler(file, field);
    return true;
  };

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const submit = async (data: IVideo) => {
    if (!video && !files.video) {
      showError('Please select a video!');
      return;
    }
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      showError('Invalid amount');
      return;
    }
    const uploadFiles = Object.keys(files).reduce((f, key) => {
      if (files[key]) {
        f.push({
          fieldname: key,
          file: files[key] || null
        });
      }
      return f;
    }, [] as IFiles[]) as [IFiles];
    setUploading(true);
    try {
      !video
        ? await videoService.uploadVideo(uploadFiles as any, data, onUploading)
        : await videoService.update(video._id, uploadFiles, data, onUploading);
      message.success(!video ? 'Video has been uploaded' : 'Video has been updated');
      router.push('/video');
    } catch (e) {
      showError(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form
      {...layout}
      onFinish={(values) => {
        const data = { ...values };
        if (data.status === 'file-error') {
          showError('Video file is on error, please upload new one');
          return;
        }
        if (data.isSchedule) {
          data.scheduledAt = scheduledAt;
        }
        if (data.tags && data.tags.length) {
          data.tags = data.tags.map((t) => t.replace(/\s+/g, '_').toLowerCase());
        }
        submit(data);
      }}
      name="video-form-upload"
      ref={formRef}
      initialValues={
        video || ({
          title: '',
          price: 9.99,
          description: '',
          status: 'active',
          performerId: '',
          tags: [],
          categoryIds: [],
          isSaleVideo: false,
          participantIds: [],
          isSchedule: false
        })
      }
      scrollToFirstError
    >
      <Form.Item
        name="performerId"
        label="Creator"
        rules={[{
          required: true, message: 'Please select a creator'
        }]}
      >
        <SelectPerformerDropdown
          defaultValue={video?.performerId || ''}
          onSelect={(val) => setFormVal('performerId', val)}
        />
      </Form.Item>
      <Form.Item
        name="title"
        label="Title"
        rules={[{
          required: true, message: 'Please input video title'
        }]}
      >
        <Input placeholder="Enter video title" />
      </Form.Item>
      <Form.Item label="Tags" name="tags">
        <Select
          defaultValue={video?.tags || []}
          onChange={(val) => setFormVal('tags', val)}
          mode="tags"
          style={{ width: '100%' }}
          size="middle"
          showArrow={false}
          defaultActiveFirstOption={false}
          placeholder="Add Tags"
        />
      </Form.Item>
      <Form.Item
        label="Participants"
        name="participantIds"
      >
        {firstLoadPerformer && (
          <Select
            defaultValue={video?.participantIds || []}
            mode="multiple"
            style={{ width: '100%' }}
            showSearch
            placeholder="Search performers here"
            optionFilterProp="children"
            onSearch={getPerformers.bind(this)}
            loading={uploading}
          >
            {performers
              && performers.length > 0
              && performers.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  <Avatar src={p?.avatar || '/no-avatar.jpg'} />
                  {' '}
                  {p?.name || p?.username || 'N/A'}
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="isSale" label="For sale?" valuePropName="checked">
        <Switch unCheckedChildren="Subscribe to view" checkedChildren="Pay per view" onChange={(val) => setIsSale(val)} />
      </Form.Item>
      {isSale && (
        <Form.Item name="price" label="Price">
          <InputNumber min={1} />
        </Form.Item>
      )}
      <Form.Item name="isSchedule" label="Scheduled?" valuePropName="checked">
        <Switch unCheckedChildren="Not scheduled" checkedChildren="Scheduled" onChange={(checked) => setIsSchedule(checked)} />
      </Form.Item>
      {isSchedule && (
        <Form.Item label="Scheduled for">
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(currentDate) => currentDate < dayjsx().endOf('day')}
            defaultValue={scheduledAt}
            onChange={(date) => setScheduledAt(dayjsx(date))}
          />
        </Form.Item>
      )}
      <Row>
        <Col lg={8} xs={24}>
          <Form.Item
            label="Video"
            help={
              (previewVideo && (
                <a
                  aria-hidden
                  onClick={() => { setIsShowPreview(true); setPreviewUrl(previewVideo?.url); setPreviewType('video'); }}
                >
                  {previewVideo?.name || 'Click here to preview'}
                </a>
              ))
              || (selectedVideo && <a>{selectedVideo?.name}</a>)
              || `Video file is ${process.env.MAX_SIZE_VIDEO || 2048}MB or below`
            }
          >
            <Upload
              customRequest={() => false}
              listType="picture-card"
              className="avatar-uploader"
              accept="video/*"
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              beforeUpload={(file) => beforeUpload(file, 'video')}
            >
              {selectedVideo ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
            </Upload>
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label="Teaser"
            help={
              (previewTeaserVideo && !removedTeaser && (
                <a
                  aria-hidden
                  onClick={() => { setIsShowPreview(true); setPreviewUrl(previewTeaserVideo?.url); setPreviewType('teaser'); }}
                >
                  {previewTeaserVideo?.name || 'Click here to preview'}
                </a>
              ))
              || (selectedTeaser && <a>{selectedTeaser?.name}</a>)
              || `Teaser is ${process.env.MAX_SIZE_TEASER || 200}MB or below`
            }
          >
            <Upload
              customRequest={() => false}
              listType="picture-card"
              className="avatar-uploader"
              accept="video/*"
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              beforeUpload={(file) => beforeUpload(file, 'teaser')}
            >
              {selectedTeaser ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
            </Upload>
            {video?.teaserId && <Button disabled={removedTeaser} onClick={() => handleRemoveFile('teaser')}>{!removedTeaser ? 'Remove Teaser' : 'Teaser was removed'}</Button>}
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label="Thumbnail"
            help={
              (previewThumbnail && !removedThumbnail && (
                <a
                  aria-hidden
                  onClick={() => { setIsShowPreview(true); setPreviewUrl(previewThumbnail?.url); setPreviewType('thumbnail'); }}
                >
                  {previewThumbnail?.name || 'Click here to preview'}
                </a>
              ))
              || (selectedThumbnail && <a>{selectedThumbnail?.name}</a>)
              || `Thumbnail is ${process.env.MAX_SIZE_IMAGE || 5}MB or below`
            }
          >
            <Upload
              customRequest={() => false}
              listType="picture-card"
              className="avatar-uploader"
              accept="image/*"
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              beforeUpload={(file) => beforeUpload(file, 'thumbnail')}
            >
              {selectedThumbnail ? <FileAddOutlined /> : <CameraOutlined />}
            </Upload>
            {video?.thumbnailId && <Button disabled={removedThumbnail} onClick={() => handleRemoveFile('thumbnail')}>{!removedThumbnail ? 'Remove Thumbnail' : 'Thumbnail was removed'}</Button>}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
        <Select>
          <Select.Option key="active" value="active">
            Active
          </Select.Option>
          <Select.Option key="inactive" value="inactive">
            Inactive
          </Select.Option>
        </Select>
      </Form.Item>
      {uploadPercentage > 0 && (
        <Progress percent={Math.round(uploadPercentage)} />
      )}
      <Form.Item className="text-center mar-10">
        <Button type="primary" htmlType="submit" disabled={uploading} loading={uploading}>
          {video ? 'Update' : 'Upload'}
        </Button>
      </Form.Item>
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
        >
          {['teaser', 'video'].includes(previewType) && (
            <VideoPlayer
              {
              ...{
                autoplay: true,
                controls: true,
                playsinline: true,
                fluid: true,
                sources: [
                  {
                    src: previewUrl,
                    type: 'video/mp4'
                  }
                ]
              }
              }
            />
          )}
          {previewType === 'thumbnail' && (
            <img
              src={previewUrl}
              alt="thumbnail"
              width="100%"
              style={{ borderRadius: 5 }}
            />
          )}
        </Modal>
      )}
    </Form>
  );
}
