import Head from 'next/head';
import {
  Breadcrumb
} from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
import Page from '@components/common/layout/page';
import { postService } from '@services/post.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListPost } from '@components/post/table-list';
import { isMobile } from 'react-device-detect';
import { showError } from '@lib/message';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';

function Posts() {
  const router = useRouter();
  const {
    sort = 'asc', sortBy = 'ordering', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(postService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const deletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await postService.delete(id);
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, deleted: id }
      });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Posts</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Page>
        <SearchFilter onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListPost
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize),
              position: ['bottomCenter'],
              showSizeChanger: false,
              simple: isMobile
            }}
            onChange={handleTableChange}
            deletePost={deletePost}
          />
        </div>
      </Page>
    </>
  );
}

export default Posts;
