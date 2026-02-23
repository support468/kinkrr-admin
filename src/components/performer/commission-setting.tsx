import {
  Form, Button, InputNumber
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  performer: IPerformer;
  submitting: boolean;
}

export function CommissionSettingForm({ performer, onFinish, submitting }: IProps) {
  return (
    <Form
      layout="vertical"
      onFinish={(data) => onFinish(data)}
      initialValues={{
        commissionPercentage: performer?.commissionPercentage || 0
      }}
    >
      <Form.Item name="commissionPercentage" label="Commission Percentage" help="Value is from 1% to 99%">
        <InputNumber min={1} max={99} style={{ width: '100%' }} step={1} />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
        <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
