import { useRouter } from 'next/router';
import Meta from '../../../components/Meta';
import MainCntHeader from '../../../components/styles/MainCntHeader';
import Title from '../../../components/styles/Title';
import Link from 'next/link';
import LinkPrimary from '../../../components/styles/LinkPrimary';

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Meta title="Detail" />
      <MainCntHeader>
        <Title>Item {id}</Title>
      </MainCntHeader>
    </>
  );
}
