import {
  Avatar,
  PaginationProps,
  Table, Tag, Image
} from 'antd';
import {
  EditOutlined, DeleteOutlined, VideoCameraOutlined, AudioOutlined, PictureOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { isMobile } from 'react-device-detect';
import { IFeed } from '@interfaces/feed';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: PaginationProps;
  onChange: Function;
  deleteFeed: Function;
}
export function TableListFeed(props: IProps) {
  const { deleteFeed } = props;
  const columns = [
    {
      title: 'Creator',
      dataIndex: 'name',
      render(data, record) {
        return (
          <>
            <Avatar src={record?.performer?.avatar || '/no-avatar.jpg'} />
            &nbsp;
            {record?.performer?.name || record?.performer?.username || 'N/A'}
          </>
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'text',
      render(data, record: IFeed) {
        return (
          <Link
            href={`/feed/update/${record._id}`}
          >
            <div style={{
              whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100px'
            }}
            >
              {record.text}
            </div>
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render(type: string, record: IFeed) {
        const videos = (record.files || []).filter((f) => f.type === 'feed-video');
        const photos = (record.files || []).filter((f) => f.type === 'feed-photo');
        return (
          <div style={{
            display: 'inline-flex', minWidth: 50, alignItems: 'center', justifyContent: 'center', gap: 10
          }}
          >
            {['video', 'photo'].includes(type) && (
              <Image
                width={60}
                height={60}
                style={{ borderRadius: 5 }}
                alt="preview-img"
                src={(photos[0]?.thumbnails[0]) || (videos[0]?.thumbnails[0])}
                loading="lazy"
                fallback="/placeholder-image.jpg"
              />
            )}
            {photos.length > 0 && (
              <span>
                <PictureOutlined />
                {' '}
                {photos.length}
              </span>
            )}
            {videos.length > 0 && (
              <span>
                <VideoCameraOutlined />
                {' '}
                {videos.length}
              </span>
            )}
            {type === 'audio' && <AudioOutlined />}
            {type === 'text' && 'Aa'}
            {type === 'scheduled-streaming' && 'Live'}
          </div>
        );
      }
    },
    {
      title: 'Content-Type',
      key: 'intendedFor',
      render: (record: IFeed) => {
        switch (record.intendedFor) {
          case 'sale':
            return <Tag color="red">PPV</Tag>;
          case 'subscriber':
            return <Tag color="blue">Subscribers only</Tag>;
          default: return <Tag color="pink">Free for follower</Tag>;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status) {
        if (status === 'inactive') {
          return <Tag color="red">Inactive</Tag>;
        }
        return <Tag color="green">Active</Tag>;
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
      render: (id: string) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={`/feed/update/${id}`}
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
              onClick: () => deleteFeed(id)
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
      columns={columns}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        ...pagination,
        position: ['bottomCenter'],
        simple: isMobile
      }}
      onChange={onChange.bind(this)}
    />
  );
}
