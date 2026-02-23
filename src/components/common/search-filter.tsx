/* eslint-disable prefer-destructuring */
import { PureComponent, useRef } from 'react';
import {
  Input, Row, Col, Select, DatePicker
} from 'antd';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectGalleryDropdown } from '@components/gallery/common/select-gallery-dropdown';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
interface IProps {
  keyword?: boolean;
  keywordPlaceholder?: string;
  onSubmit?: Function;
  keyFilter?: string;
  statuses?: {
    key: string;
    text: string;
  }[];
  sourceType?: {
    key: string;
    text?: string;
  }[];
  type?: {
    key: string;
    text?: string;
  }[];
  defaultType?: string;
  defaultStatus?: string;
  searchWithPerformer?: boolean;
  performerId?: string;
  searchWithGallery?: boolean;
  galleryId?: string;
  dateRange?: boolean;
}

export function SearchFilter({
  onSubmit,
  statuses = [],
  searchWithPerformer = false,
  searchWithGallery = false,
  keyword = false,
  dateRange = false,
  performerId = '',
  galleryId = '',
  sourceType = [],
  keywordPlaceholder = '',
  type = [],
  defaultType = '',
  defaultStatus = ''
}: IProps) {
  const filter = useRef({
    q: ''
  }) as any;

  const handleSubmit = (key: string, value: string) => {
    filter.current[key] = value;
    onSubmit(filter.current);
  };

  return (
    <Row gutter={24}>
      {keyword ? (
        <Col lg={6} md={8}>
          <Input
            placeholder={keywordPlaceholder || 'Enter keyword'}
            onChange={(evt) => { filter.current.q = evt.target.value; }}
            onPressEnter={() => onSubmit(filter.current)}
          />
        </Col>
      ) : null}
      {statuses && statuses.length > 0 ? (
        <Col lg={6} md={8}>
          <Select
            onChange={(val) => {
              handleSubmit('status', val);
            }}
            style={{ width: '100%' }}
            placeholder="Select status"
            defaultValue={defaultStatus || ''}
          >
            {statuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      ) : null}
      {type && type.length > 0 ? (
        <Col lg={6} md={8}>
          <Select
            onChange={(val) => {
              handleSubmit('type', val);
            }}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue={defaultType || ''}
          >
            {type.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      ) : null}
      {sourceType && sourceType.length > 0 ? (
        <Col lg={6} md={8}>
          <Select
            onChange={(val) => {
              handleSubmit('sourceType', val);
            }}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue=""
          >
            {sourceType.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      ) : null}
      {searchWithPerformer && (
      <Col lg={6} md={8}>
        <SelectPerformerDropdown
          placeholder="Search performer"
          style={{ width: '100%' }}
          onSelect={(val) => {
            handleSubmit('performerId', val);
          }}
          defaultValue={performerId || ''}
          showAll
        />
      </Col>
      )}
      {searchWithGallery && (
      <Col lg={6} md={8}>
        <SelectGalleryDropdown
          placeholder="Type to search gallery here"
          style={{ width: '100%' }}
          onSelect={(val) => handleSubmit('galleryId', val)}
          defaultValue={galleryId || ''}
          showAll
        />
      </Col>
      )}
      {dateRange && (
      <Col lg={6} md={8}>
        <RangePicker
          disabledDate={(current) => current > dayjs().endOf('day') || current < dayjs().subtract(10, 'years').endOf('day')}
          showTime
          onChange={(dates: [any, any], dateStrings: [string, string]) => {
            filter.current.fromDate = dateStrings[0];
            filter.current.toDate = dateStrings[1];
            onSubmit(filter.current);
          }}
        />
      </Col>
      )}
    </Row>
  );
}
