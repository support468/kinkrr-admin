import { BreadcrumbComponent, SearchFilter } from '@components/common';
import Page from '@components/common/layout/page';
import TableListReferral from '@components/referral/table-list-referral';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { referralService } from '@services/index';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Referrals() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'createdAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(referralService.adminSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  return (
    <>
      <Head>
        <title>Referrals</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Referrals' }]} />
      <Page>
        <SearchFilter onSubmit={handleFilter} dateRange />
        <div className="table-responsive">
          <TableListReferral
            searching={isLoading}
            referrals={data?.data || []}
            total={data?.total || 0}
            pageSize={Number(pageSize)}
            current={(Number(current))}
            onChange={handleTableChange}
          />
        </div>
      </Page>
    </>
  );
}

export default Referrals;
