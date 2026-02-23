import { useRef } from 'react';
import {
  Input, Row, Col, Select
} from 'antd';
import { debounce } from 'lodash';

interface IProps {
  onSubmit: Function;
  defaultValue: any;
}

export default function PerformerSearchFilter({
  onSubmit, defaultValue
}: IProps) {
  const state = useRef({
    q: '',
    status: '',
    verifiedEmail: '',
    verifiedDocument: '',
    verifiedAccount: '',
    isFeatured: '',
    ...defaultValue
  });

  const handleSubmit = (key: string, value: string) => {
    state.current[key] = value;
    onSubmit(state.current);
  };

  const onChangeKeyword = debounce((txt: string) => {
    state.current.q = txt;
    onSubmit(state.current);
  }, 500);

  return (
    <Row gutter={24}>
      <Col lg={4} xs={24}>
        <Input
          placeholder="Enter keyword"
          onChange={(evt) => onChangeKeyword(evt.target.value)}
          onPressEnter={() => onSubmit(state.current)}
        />
      </Col>
      <Col lg={4} xs={12}>
        <Select
          defaultValue={state.current.status}
          style={{ width: '100%' }}
          onChange={(val) => handleSubmit('status', val)}
        >
          <Select.Option value="">All Statuses</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </Col>
      <Col lg={4} xs={12}>
        <Select
          defaultValue={state.current.verifiedEmail}
          style={{ width: '100%' }}
          onChange={(val) => handleSubmit('verifiedEmail', val)}
        >
          <Select.Option value="">All Email Verification</Select.Option>
          <Select.Option key="verified" value="true">
            Verified Email
          </Select.Option>
          <Select.Option key="notVerified" value="false">
            Not Verified Email
          </Select.Option>
        </Select>
      </Col>
      <Col lg={4} xs={12}>
        <Select
          defaultValue={state.current.verifiedDocument}
          style={{ width: '100%' }}
          onChange={(val) => handleSubmit('verifiedDocument', val)}
        >
          <Select.Option value="">All ID Verification</Select.Option>
          <Select.Option key="verified" value="true">
            Verified ID
          </Select.Option>
          <Select.Option key="notVerified" value="false">
            Not Verified ID
          </Select.Option>
        </Select>
      </Col>
      <Col lg={4} xs={12}>
        <Select
          defaultValue={state.current.verifiedAccount}
          style={{ width: '100%' }}
          onChange={(val) => handleSubmit('verifiedAccount', val)}
        >
          <Select.Option value="">All Account Verification</Select.Option>
          <Select.Option key="verified" value="true">
            Verified Account
          </Select.Option>
          <Select.Option key="notVerified" value="false">
            Not Verified Account
          </Select.Option>
        </Select>
      </Col>
      <Col lg={4} xs={12}>
        <Select
          defaultValue={state.current.isFeatured}
          style={{ width: '100%' }}
          onChange={(val) => handleSubmit('isFeatured', val)}
        >
          <Select.Option value="">All type</Select.Option>
          <Select.Option key="isFeatured" value="true">
            Featured Account
          </Select.Option>
          <Select.Option key="notFeatured" value="false">
            Not Featured Account
          </Select.Option>
        </Select>
      </Col>
    </Row>
  );
}
