import notFound from '../assets/imgs/NotFound.jpg';

function  NotFound(){
    return(
        <div 
        style={{ 
            textAlign: 'center', 
            marginTop: '2rem' 
            }
        }
        >
            <h1>Not Found</h1>
            <img src={notFound} alt="Pagina no encontrada" 
            style={{ 
                height: '100vh',
                margin:'auto',
                alignItems: 'center',
                padding: '3rem',
                }
            }
            />
        </div>
    )
}

export default NotFound;