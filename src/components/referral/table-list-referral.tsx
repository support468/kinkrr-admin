import { formatDate } from '@lib/date';
import { Table, Tag } from 'antd';
import { isMobile } from 'react-device-detect';

interface IProps {
  referrals: any[];
  searching: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChange: Function;
}

function TableListReferral({
  referrals, searching, total, pageSize, current, onChange
}: IProps) {
  const columns = [
    {
      title: 'Referred person',
      render(data, record) {
        return <span>{record?.registerInfo.name || record?.registerInfo.username}</span>;
      }
    },
    {
      title: 'Presenter',
      render(data, record) {
        return <span>{record?.referralInfo.name || record?.referralInfo.username}</span>;
      }
    },
    {
      title: 'Role',
      render(data, record) {
        switch (record?.registerSource) {
          case 'performer':
            return <Tag color="cyan">Model</Tag>;
          case 'user':
            return <Tag color="geekblue">Fan</Tag>;
          default: return <Tag color="default">{record?.registerSource}</Tag>;
        }
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    }
  ];

  const dataSource = referrals?.map((p) => ({ ...p, key: p._id }));
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize,
        current,
        position: ['bottomCenter'],
        showSizeChanger: false,
        simple: isMobile
      }}
      rowKey="_id"
      showSorterTooltip={false}
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
}

export default TableListReferral;
