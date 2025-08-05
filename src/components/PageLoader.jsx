import { Spinner } from 'react-bootstrap';
import { LoadingContext } from '../context/LoadingContext';
import '../styles/PageLoader.css';
import { useContext } from 'react';

const PageLoader = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return null;

  return (
    <div className="overlay-spinner">
      <Spinner animation="border" variant="primary" />
      <p className="overlay-text">Procesando...</p>
    </div>
  );
};

export default PageLoader;