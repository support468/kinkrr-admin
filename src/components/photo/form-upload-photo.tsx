import { useRef, useState } from 'react';
import {
  Form, Input, Select, Upload, Button, message, Progress
} from 'antd';
import { IPhoto } from 'src/interfaces';
import { CameraOutlined } from '@ant-design/icons';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectGalleryDropdown } from '@components/gallery/common/select-gallery-dropdown';
import getConfig from 'next/config';
import Image from 'next/image';
import { getBase64 } from '@lib/file';
import { photoService } from '@services/photo.service';
import Router from 'next/router';
import { showError, validateMessages } from '@lib/message';

const { publicRuntimeConfig: config } = getConfig();
interface IProps {
  photo?: IPhoto;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function FormUploadPhoto({
  photo
}: IProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedPerformerId, setSelectedPerformerId] = useState(photo?.performerId || '');
  const _file = useRef(null);
  const [formRef] = Form.useForm();

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const setFormVal = (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
    if (field === 'performerId') setSelectedPerformerId(val);
  };

  const beforeUpload = (file) => {
    const isMaxSize = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
    if (!isMaxSize) {
      message.error(`Image must be smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`);
      return false;
    }

    setPreviewImage(URL.createObjectURL(file));
    _file.current = file;
    return true;
  };

  const handleSubmit = async (data: any) => {
    try {
      if (!photo && !_file.current) {
        message.error('Please select a photo');
        return;
      }
      setUploading(true);
      photo ? await photoService.update(photo._id, data) : await photoService.uploadPhoto(_file.current, {
        ...data,
        title: _file?.current?.name || `photo_${new Date().getTime()}`
      }, onUploading);
      message.success('Updated successfully');
      Router.push('/gallery');
    } catch (e) {
      showError(e);
      setUploading(false);
    }
  };

  const urlThumb = photo?.photo?.url || (photo?.photo?.thumbnails && photo?.photo?.thumbnails[0]) || '/no-image.jpg';

  return (
    <Form
      {...layout}
      onFinish={(data) => {
        if (!data.performerId) {
          message.error('Please select a creator!');
          return;
        }
        if (!data.galleryId) {
          message.error('Please select a gallery!');
          return;
        }
        handleSubmit(data);
      }}
      form={formRef}
      validateMessages={validateMessages}
      initialValues={
        photo || ({
          title: '',
          description: '',
          status: 'active',
          performerId: '',
          galleryId: ''
        })
      }
    >
      <Form.Item name="performerId" label="Creator" rules={[{ required: true, message: 'Please select a creator' }]}>
        <SelectPerformerDropdown
          defaultValue={selectedPerformerId || ''}
          onSelect={(val) => setFormVal('performerId', val)}
        />
      </Form.Item>
      <Form.Item name="galleryId" label="Gallery" rules={[{ required: true, message: 'Please select a gallery' }]}>
        <SelectGalleryDropdown
          defaultValue={photo?.galleryId || ''}
          onSelect={(val) => setFormVal('galleryId', val)}
          performerId={selectedPerformerId}
        />
      </Form.Item>
      {/* <Form.Item name="title" rules={[{ required: true, message: 'Please input photo title!' }]} label="Title">
        <Input placeholder="Enter photo title" />
      </Form.Item> */}
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
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
      <Form.Item help={`Image must be smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`}>
        {!photo ? (
          <Upload
            listType="picture-card"
            customRequest={() => false}
            accept={'image/*,.heic,.heif'}
            multiple={false}
            showUploadList={false}
            disabled={uploading}
            beforeUpload={(file) => beforeUpload(file)}
          >
            {previewImage ? (
              <Image
                src={previewImage}
                alt="file"
                width={250}
                height={250}
                sizes="30vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            <CameraOutlined />
          </Upload>
        ) : (
          <Image
            src={urlThumb}
            width={250}
            height={250}
            sizes="30vw"
            style={{ width: 'auto' }}
            alt="thumb"
          />
        )}
        {uploadPercentage ? <Progress percent={uploadPercentage} /> : null}
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
        <Button type="primary" htmlType="submit" loading={uploading}>
          {photo ? 'Update' : 'Upload'}
        </Button>
      </Form.Item>
    </Form>
  );
}

FormUploadPhoto.defaultProps = {
  photo: null
};

export default FormUploadPhoto;
