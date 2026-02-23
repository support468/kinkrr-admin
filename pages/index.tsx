import Head from 'next/head';
import {
  Row, Col, Statistic, Card
} from 'antd';
import { utilsService } from '@services/utils.service';
import {
  AreaChartOutlined, PieChartOutlined, BarChartOutlined,
  LineChartOutlined, DotChartOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';

export default function Dashboard() {
  const {
    data: stats, isLoading: fetching
  } = useClientFetch(buildUrl(utilsService.statisticsEndpoint(), {}));
  const {
    data: statsEarning, isLoading: loading
  } = useClientFetch(buildUrl(utilsService.earningstatisticsEndpoint(), {}));

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="dashboard-stats">
        <Row>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { status: 'active' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="ACTIVE USERS"
                  value={stats?.totalActiveUsers || 0}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { status: 'inactive' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="INACTIVE USERS"
                  value={stats?.totalInactiveUsers || 0}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/users', query: { verifiedEmail: false } }}>
              <Card loading={fetching}>
                <Statistic
                  title="NOT VERIFIED EMAIL USERS"
                  value={stats?.totalPendingUsers || 0}
                  valueStyle={{ color: '#ffc107' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { status: 'active' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="ACTIVE CREATORS"
                  value={stats?.totalActivePerformers || 0}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>

          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { status: 'inactive' } }}>
              <Card loading={fetching}>
                <Statistic
                  title="INACTIVE CREATORS"
                  value={stats?.totalInactivePerformers || 0}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { verifiedDocument: false } }}>
              <Card loading={fetching}>
                <Statistic
                  title="NOT VERIFIED ID CREATORS"
                  value={stats?.totalPendingPerformers || 0}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { isFeatured: true } }}>
              <Card loading={fetching}>
                <Statistic
                  title="FEATURED CREATORS"
                  value={stats?.totalFeaturedPerformers || 0}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href={{ pathname: '/creator', query: { isFeatured: false } }}>
              <Card loading={fetching}>
                <Statistic
                  title="NON-FEATURED CREATORS"
                  value={stats?.totalNonFeaturedPerformers || 0}
                  valueStyle={{ color: '#009688' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/feed">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL POSTS"
                  value={stats?.totalPosts || 0}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/gallery">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL GALLERIES"
                  value={stats?.totalGalleries || 0}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/photos">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL PHOTOS"
                  value={stats?.totalPhotos || 0}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/video">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL VIDEOS"
                  value={stats?.totalVideos || 0}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/product">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL PRODUCTS"
                  value={stats?.totalProducts || 0}
                  valueStyle={{ color: '#5399d0' }}
                  prefix={<PieChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/subscription">
              <Card loading={fetching}>
                <Statistic
                  title="TOTAL SUBSCRIBERS"
                  value={stats?.totalSubscribers || 0}
                  valueStyle={{ color: '#941fd0' }}
                  prefix={<DotChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/subscription?status=active">
              <Card loading={fetching}>
                <Statistic
                  title="ACTIVE SUBSCRIBERS"
                  value={stats?.totalActiveSubscribers || 0}
                  valueStyle={{ color: '#941fd0' }}
                  prefix={<DotChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={loading}>
                <Statistic
                  title="TOTAL EARNINGS"
                  value={`${(statsEarning?.totalGrossPrice || 0).toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={loading}>
                <Statistic
                  title="PLATFORM EARNINGS"
                  value={`${(statsEarning?.totalPriceCommission || 0).toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/earnings">
              <Card loading={loading}>
                <Statistic
                  title="CREATOR'S EARNINGS"
                  value={`${(statsEarning?.totalNetPrice || 0).toFixed(2)}`}
                  valueStyle={{ color: '#fb2b2b' }}
                  prefix="$"
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=shipping">
              <Card loading={loading}>
                <Statistic
                  title="SHIPPED ORDERS"
                  value={statsEarning?.totalShippingdOrders || 0}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=delivered">
              <Card loading={loading}>
                <Statistic
                  title="DELIVERED ORDERS"
                  value={statsEarning?.totalDeliveredOrders || 0}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
          <Col md={8} xs={12}>
            <Link href="/order?deliveryStatus=refunded">
              <Card loading={loading}>
                <Statistic
                  title="REFUNDED ORDERS"
                  value={statsEarning?.totalRefundedOrders || 0}
                  valueStyle={{ color: '#c8d841' }}
                  prefix={<AreaChartOutlined />}
                />
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}
