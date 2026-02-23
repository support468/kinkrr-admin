import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import FormUploadVideo from '@components/video/form-upload-video';
import Head from 'next/head';

function UploadVideo() {
  return (
    <>
      <Head>
        <title>Upload video</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Video', href: '/video' }, { title: 'Upload new video' }]} />
      <Page>
        <FormUploadVideo />
      </Page>
    </>
  );
}

export default UploadVideo;
