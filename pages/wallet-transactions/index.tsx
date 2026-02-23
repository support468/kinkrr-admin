import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import PaymentTableList from '@components/purchase-item/payment-token-history-table';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { tokenTransactionService } from 'src/services';

export default function PurchasedItemHistoryPage() {
  // const [searching, setSearching] = useState(false);
  // const [paymentList, setPaymentList] = useState([]);
  // const [pagination, setPagination] = useState({
  //   total: 0,
  //   pageSize: 10,
  //   current: 1,
  //   responsive: Boolean
  // });
  // const [sortBy, setSortBy] = useState('updatedAt');
  // const [sort, setSort] = useState('desc');
  // const [filter, setFilter] = useState({});
  // const [loading, setLoading] = useState(true);

  // const userSearchTransactions = async () => {
  //   try {
  //     setLoading(true);
  //     setSearching(true);
  //     const resp = await tokenTransactionService.search({
  //       ...filter,
  //       sort,
  //       sortBy,
  //       limit: pagination.pageSize,
  //       offset: (pagination.current - 1) * pagination.pageSize
  //     });
  //     setSearching(false);
  //     setPaymentList(resp.data.data);
  //     setPagination({ ...pagination, total: resp.data.total });
  //   } catch (e) {
  //     showError(e);
  //     setSearching(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleTableChange = async (page, filters, sorter) => {
  //   setPagination({ ...pagination, current: page.current });
  //   setSortBy(sorter.field || 'updatedAt');
  //   // eslint-disable-next-line no-nested-ternary
  //   setSort(sorter.order
  //     ? sorter.order === 'descend'
  //       ? 'desc'
  //       : 'asc'
  //     : 'desc');
  //   userSearchTransactions();
  // };

  const router = useRouter();

  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(tokenTransactionService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const type = [
    {
      key: '',
      text: 'All types'
    },
    {
      key: 'feed',
      text: 'Post'
    },
    {
      key: 'video',
      text: 'Video'
    },
    {
      key: 'product',
      text: 'Product'
    },
    {
      key: 'gallery',
      text: 'Gallery'
    },
    {
      key: 'tip',
      text: 'Creator Tip'
    },
    {
      key: 'stream_tip',
      text: 'Streaming Tip'
    },
    {
      key: 'public_chat',
      text: 'Streaming'
    }
  ];

  return (
    <>
      <Head>
        <title>Wallet Transactions</title>
      </Head>
      <Page>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Wallet Transactions' }]} />
        <SearchFilter
          type={type}
          onSubmit={handleFilter}
          dateRange
        />
        <div className="table-responsive">
          <PaymentTableList
            dataSource={data?.data || []}
            pagination={{
              current: Number(current || 1),
              total: data?.total || 0,
              position: ['bottomCenter'],
              showSizeChanger: false,
              simple: isMobile
            }}
            onChange={handleTableChange}
            rowKey="_id"
            loading={isLoading}
          />
        </div>
      </Page>
    </>
  );
}
