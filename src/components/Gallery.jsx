import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';
import '../styles/Gallery.css';
import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';

function Gallery({ title, text, image, buttonText, id, author, phone, stars, category, icon, price }) {
  const {token} = useContext(TokenContext);
  return (
    <Card className="gallery-card">
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{title} 
          <ReactStars
          count={5}
          value={stars}
          size={19}
          color2={'#ffd700'} 
          edit={false} />
          {icon}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle>
        <Card.Text><strong>Precios desde : $</strong> {price}.-</Card.Text>
        <Card.Text><strong>Autor:</strong> {author}</Card.Text>
        <Card.Text><strong>Telefono:</strong> {phone}</Card.Text>
        <Card.Text><strong>Descripción: </strong>{text}</Card.Text>
       
        {!token ?
         <div className="gallery-buttons">
          <Button as={Link} to={`/interaction/${id}`} variant="primary" className="gallery-button">{buttonText}</Button>
          </div>
          :
          <div className="gallery-buttons">
            <Button as={Link} to={`/interaction/${id}`} variant="primary" className="gallery-button">{buttonText}</Button>
            <Button as={Link} to={`/interaction/${id}`} variant="primary" className="gallery-button">Comentar</Button>
          </div>
        }
      </Card.Body>
    </Card>
  );
}

export default Gallery;