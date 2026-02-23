import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/performer/AccountForm';
import { BankingForm } from '@components/performer/BankingForm';
import { PerformerDocument } from '@components/performer/Document';
import { SubscriptionForm } from '@components/performer/Subcription';
import { CommissionSettingForm } from '@components/performer/commission-setting';
import { PerformerPaypalForm } from '@components/performer/paypalForm';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { authService, performerCategoryService, performerService } from '@services/index';
import { Tabs, message } from 'antd';
import { omit } from 'lodash';
import Head from 'next/head';
import { NextPageContext } from 'next/types';
import {
  useState
} from 'react';
import {
  IPerformer,
  IPerformerCategory
} from 'src/interfaces';
import nextCookie from 'next-cookies';

interface IProps {
  performer: IPerformer;
  categories: IPerformerCategory[];
}
function PerformerUpdate({
  performer, categories
}: IProps) {
  const [performerData, setPerformer] = useState(performer);
  const [pwUpdating, setPwUpdating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settingUpdating, setSettingUpdating] = useState(false);

  const updatePassword = async (data: any) => {
    try {
      setPwUpdating(true);
      await authService.updatePassword(data.password, performer._id, 'performer');
      message.success('Password has been updated!');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setPwUpdating(false);
    }
  };

  const updatePaymentGatewaySetting = async (key: string, data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updatePaymentGatewaySetting(performer._id, {
        performerId: performer._id,
        key: key || 'ccbill',
        status: 'active',
        value: data
      });
      message.success('Updated successfully!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const updateCommissionSetting = async (data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updateCommissionSetting(performer._id, { ...data, performerId: performer._id });
      message.success('Updated commission setting successfully!');
    } catch (error) {
      const err = await error;
      message.error(err?.message || 'An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const updateBankingSetting = async (data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updateBankingSetting(performer._id, { ...data, performerId: performer._id });
      message.success('Updated successfully!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const submit = async (data: any) => {
    let newData = data;
    try {
      if (data.status === 'pending-email-confirmation') {
        newData = omit(data, ['status']);
      }
      setUpdating(true);
      const resp = await performerService.update(performer._id, {
        ...performer,
        ...newData
      });
      setPerformer(resp.data);
      message.success('Updated successfully');
    } catch (e) {
      // TODO - exact error message
      const error = await e;
      message.error(error && (error.message || 'An error occurred, please try again!'));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Creator update</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Creators', href: '/creator' },
          { title: performerData?.name || performerData?.username || '' },
          { title: 'Update' }
        ]}
      />
      <Page>
        <Tabs defaultActiveKey="basic" tabPosition="top">
          <Tabs.TabPane tab={<span>Basic Settings</span>} key="basic">
            <AccountForm
              onFinish={submit}
              performer={performerData}
              submiting={updating}
              categories={categories}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>ID Documents</span>} key="document">
            <PerformerDocument
              submitting={updating}
              onFinish={submit}
              performer={performerData}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Pricing</span>} key="subscription">
            <SubscriptionForm
              submitting={updating}
              onFinish={submit}
              performer={performerData}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Commission</span>} key="commission">
            <CommissionSettingForm
              submitting={settingUpdating}
              onFinish={updateCommissionSetting}
              performer={performerData}
            />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={<span>CCbill</span>} key="ccbill">
                <CCbillSettingForm
                  submitting={settingUpdating}
                  onFinish={this.updatePaymentGatewaySetting.bind(this, 'ccbill')}
                  ccillSetting={performer.ccbillSetting}
                />
              </Tabs.TabPane> */}
          <Tabs.TabPane tab={<span>Banking</span>} key="banking">
            <BankingForm
              submitting={settingUpdating}
              onFinish={updateBankingSetting}
              bankingInformation={performerData.bankingInformation || null}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Paypal</span>} key="paypal">
            <PerformerPaypalForm
              updating={settingUpdating}
              onFinish={updatePaymentGatewaySetting.bind(this, 'paypal')}
              user={performerData}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Change password</span>} key="password">
            <UpdatePaswordForm onFinish={updatePassword} updating={pwUpdating} />
          </Tabs.TabPane>
        </Tabs>
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);
  const [performer, categories] = await Promise.all([
    performerService.findById(`${id}`, {
      Authorization: token || ''
    }),
    performerCategoryService.search({
      limit: 200
    }, {
      Authorization: token || ''
    })
  ]);
  return {
    props: {
      performer: performer.data,
      categories: categories.data.data
    }
  };
};

export default PerformerUpdate;
