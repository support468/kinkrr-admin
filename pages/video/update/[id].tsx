import { BreadcrumbComponent } from '@components/common';
import Loader from '@components/common/base/loader';
import Page from '@components/common/layout/page';
import FormUploadVideo from '@components/video/form-upload-video';
import { videoService } from '@services/video.service';
import Head from 'next/head';
import { NextPageContext } from 'next/types';
import { IVideo } from 'src/interfaces';
import nextCookie from 'next-cookies';

interface IProps {
  video: IVideo;
}

function VideoUpdate({
  video
}: IProps) {
  return (
    <>
      <Head>
        <title>Edit Video</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Video', href: '/video' },
          { title: video.title ? video.title : 'Edit video' }
        ]}
      />
      <Page>
        <FormUploadVideo
          video={video}
        />
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);

  const resp = await videoService.findById(`${id}`, {
    Authorization: token || ''
  });

  return {
    props: {
      video: resp.data
    }
  };
};
export default VideoUpdate;
