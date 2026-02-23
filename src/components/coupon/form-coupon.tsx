import {
  Form, Input, Button, InputNumber, Select, DatePicker,
  Row,
  Col
} from 'antd';
import { ICouponUpdate } from 'src/interfaces';
import dayjs from 'dayjs';

interface IProps {
  coupon?: ICouponUpdate;
  onFinish: Function;
  submitting: boolean;
}

export function FormCoupon(props: IProps) {
  const { coupon, onFinish, submitting } = props;
  return (
    <Form
      onFinish={(data) => onFinish(data)}
      initialValues={
        coupon
          ? {
            ...coupon,
            expiredDate: coupon.expiredDate ? dayjs(coupon.expiredDate) : null
          }
          : ({
            name: '',
            description: '',
            code: '',
            value: 10,
            status: 'active',
            expiredDate: null,
            numberOfUses: 1
          })
      }

      layout="vertical"
    >
      <Row>
        <Col md={24}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input name of the coupon' }]} label="Name">
            <Input placeholder="Coupon name" />
          </Form.Item>

        </Col>
        <Col md={24}>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

        </Col>

        <Col md={12}>
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]*$/g,
                message: 'Please input alphanumerics only'
              },
              { required: true, message: 'Please input the coupon code' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            name="value"
            label="Discount percentage 1% to 99%"
            rules={[
              { required: true, message: 'Please input discount percentage of the coupon' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={99} step={1} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            name="numberOfUses"
            label="Maximum number of people who can use this coupon"
            rules={[{ required: true, message: 'Please input number of uses' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            name="expiredDate"
            label="Expiry Date"
            rules={[{ required: true, message: 'Please input the expiry date of coupon' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current < dayjs().endOf('day')}
            />
          </Form.Item>
        </Col>
        <Col md={24}>
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
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit" loading={submitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
