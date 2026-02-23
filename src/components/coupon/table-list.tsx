import { Table, Tag } from 'antd';
import {
  DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { ICoupon } from '@interfaces/coupon';
import { copyToClipboard } from '@lib/utils';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: any;
  onChange: Function;
  deleteCoupon: Function;
}

export function TableListCoupon(props: IProps) {
  const { deleteCoupon } = props;
  const columns = [
    {
      title: 'Name',
      sorter: true,
      render(record: ICoupon) {
        return (
          <Link
            href={`/coupon/update/${record._id}`}
          >
            {record.name}
          </Link>
        );
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: true,
      render(code: string) {
        return <a aria-hidden onClick={() => copyToClipboard(code)}>{code}</a>;
      }
    },
    {
      title: 'Discount percentage',
      dataIndex: 'value',
      sorter: true,
      render(value: number) {
        return `${value}`;
      }
    },
    {
      title: 'Number of Uses',
      dataIndex: 'numberOfUses',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'inactive':
            return <Tag color="red">Inactive</Tag>;
          default: return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredDate',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date, 'YYYY-MM-DD')}</span>;
      }
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (data, record) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={`/coupon/update/${record._id}`}
                >
                  <EditOutlined />
                  {' '}
                  Update
                </Link>
              )
            },
            {
              key: 'delete',
              name: 'Delete',
              children: (
                <a>
                  <DeleteOutlined />
                  {' '}
                  Delete
                </a>
              ),
              onClick: () => deleteCoupon && deleteCoupon(record._id)
            }
          ]}
        />
      )
    }
  ];
  const {
    dataSource, rowKey, loading, pagination, onChange
  } = props;
  return (
    <Table
      dataSource={dataSource}
      pagination={pagination}
      columns={columns}
      rowKey={rowKey}
      loading={loading}
      onChange={onChange.bind(this)}
    />
  );
}
