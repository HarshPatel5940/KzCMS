import ImageCardList from '@/components/ImageCardList';
import Layout from '@/components/Layout';
import EditData from '@/components/EditData';
import { useRouter } from 'next/router';
import server from '@/utils/server';
import nookies from 'nookies';
import { useState } from 'react';
import Head from 'next/head';
import type { AxiosResponse } from 'axios';
import AddCircleLineIcon from 'remixicon-react/AddCircleLineIcon';
import CloseCircleLineIcon from 'remixicon-react/CloseCircleLineIcon';
import ProjectDataType from '@/interfaces/projectDataType';
import UserDataType from '@/interfaces/userDataType';
import type { GetServerSidePropsContext } from 'next';
import 'react-toastify/dist/ReactToastify.css';

export default function Project({ user, projectData }: { user: UserDataType; projectData: ProjectDataType[] }) {
  const router = useRouter();
  const [addAssetState, setAddAssetState] = useState(false);

  const handleAddAsset = () => {
    if (!addAssetState) {
      setAddAssetState(true);
    } else if (addAssetState) {
      setAddAssetState(false);
    }
  };

  return (
    <>
      <Head>
        <title>{router.query.project?.toString().toUpperCase()}</title>
      </Head>
      <Layout user={user}>
        <div className="w-full h-full flex flex-col gap-10">
          <div className="w-full h-fit">
            <h1 className="font-bold text-2xl lg:text-4xl">{router.query.project?.toString().toUpperCase()}</h1>
            <div>
              <div className="flex justify-end items-center">
                {!addAssetState ? (
                  <button
                    className="flex justify-center items-center gap-2 bg-secondary py-3 px-5 rounded-lg"
                    onClick={handleAddAsset}
                  >
                    <AddCircleLineIcon />
                    Add Asset
                  </button>
                ) : (
                  <button
                    className="flex justify-center items-center gap-2 bg-secondary py-3 px-5 rounded-lg"
                    onClick={handleAddAsset}
                  >
                    <CloseCircleLineIcon />
                  </button>
                )}
              </div>

              <EditData addAssetState={addAssetState} setAddAssetState={setAddAssetState} />
            </div>
            <ImageCardList dataList={projectData} />
          </div>
        </div>
      </Layout>
    </>
  );
}

interface projectDataResponseType {
  data: AxiosResponse<ProjectDataType[]>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const { project } = ctx.query;

  if (!cookies.token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const userResponse = await server.get('/api/users/user', {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    const projectDataResponse: projectDataResponseType = await server.get(`/api/projects/${project}`, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    });

    return {
      props: {
        user: userResponse.data.data as UserDataType,
        projectData: projectDataResponse.data.data as ProjectDataType[],
      },
    };
  } catch (err) {
    nookies.destroy(ctx, 'token');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
