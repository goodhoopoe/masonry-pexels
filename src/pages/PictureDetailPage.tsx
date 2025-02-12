import { useParams } from 'react-router-dom';
import { PictureDetails } from '../components/PictureDetails';

export function PictureDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <PictureDetails id={id} />;
}
