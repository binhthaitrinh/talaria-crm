import { useRouter } from 'next/router';
import Meta from '../../components/Meta';
import Title from '../../components/styles/Title';
import MainContent from '../../components/styles/MainContent';
import MainCntHeader from '../../components/styles/MainCntHeader';

export default function ItemDetail(props) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Meta title="Detail" />
      <MainCntHeader>
        <Title>Item {id}</Title>
      </MainCntHeader>
      <MainContent />
    </>
  );
}
