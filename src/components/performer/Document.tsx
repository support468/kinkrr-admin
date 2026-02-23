import { useEffect, useState } from 'react';
import {
  Form, Button, Row, Col, Image, Switch, message
} from 'antd';
import { IPerformer } from 'src/interfaces';
import { performerService, authService } from '@services/index';
import { ImageUpload } from '@components/file/image-upload';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  performer: IPerformer;
  onFinish: Function;
  submitting: boolean;
}

export function PerformerDocument({ onFinish, submitting, performer }: IProps) {
  const [idVerificationUrl, setIdVerificationUrl] = useState('');
  const [documentVerificationUrl, setDocumentVerificationUrl] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    setIdVerificationUrl(performer?.idVerification?.url || '');
    setDocumentVerificationUrl(performer?.documentVerification?.url || '');
    form.setFieldsValue({
      verifiedDocument: performer?.verifiedDocument
    });
  }, [performer]);

  const uploadHeaders = {
    authorization: authService.getToken()
  };

  return (
    <Form
      {...layout}
      form={form}
      initialValues={performer}
      onFinish={onFinish.bind(this)}
    >
      <Row>
        <Col md={12} xs={24}>
          <Form.Item
            style={{ textAlign: 'center' }}
            label="Govt issued ID photo"
          >
            <ImageUpload
              uploadUrl={`${performerService.getUploadDocumentUrl()}/${performer._id}/idVerificationId`}
              headers={uploadHeaders}
              onUploaded={(resp) => {
                setIdVerificationUrl(resp.response.data.url);
                message.success('ID photo uploaded successfully!');
              }}
            />
            {idVerificationUrl ? (
              <Image alt="id-img" src={idVerificationUrl} style={{ margin: 5, height: '150px' }} />
            ) : <img src="/front-id.png" height="150px" alt="id-img" />}
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            style={{ textAlign: 'center' }}
            label="Selfie with ID photo and handwritten note"
          >
            <ImageUpload
              uploadUrl={`${performerService.getUploadDocumentUrl()}/${performer._id}/documentVerificationId`}
              headers={uploadHeaders}
              onUploaded={(resp) => {
                setDocumentVerificationUrl(resp.response.data.url);
                message.success('Selfie with ID photo uploaded successfully!');
              }}
            />
            {documentVerificationUrl ? (
              <Image alt="id-img" src={documentVerificationUrl} style={{ margin: 5, height: '150px' }} />
            ) : <img src="/holding-id.jpg" height="150px" alt="holding-id" />}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="verifiedDocument"
            label="Verified ID Documents?"
            valuePropName="checked"
            help="Allow creator to start posting contents"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
