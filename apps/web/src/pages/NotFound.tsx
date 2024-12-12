import { Card } from '@noita-explorer/noita-component-library';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Card>
      <div>There was an error.</div>
      <Link to={'/'}>Go back</Link>
    </Card>
  );
};
