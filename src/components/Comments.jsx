import React, { useContext, useEffect, useState } from 'react'
import Pagination from './Pagination';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

const Comments = ({ comments, limit, style, origin, userService }) => {
    const [page, setPage] = useState(1);
    const [commentsPag, setCommentsPag] = useState()
    const [isLoad, setIsLoad] = useState(false);
    const { usuario } = useContext(AuthContext);

    useEffect(() => {
        const getData = () => {
            const offset = (page - 1) * limit;
            if (comments) {
                const commPag = comments.slice(offset, offset + limit);
                setCommentsPag(commPag);
                setIsLoad(true);
            } else {
                console.log("no hay comentarios");
                setIsLoad(false);
            }

        }

        getData();
    }, [page])
    return (
        <div>
            {isLoad ? (
                <>
                    <div className={style}>
                        {{
                            "home":
                                <div className="home-comments-container">
                                    {commentsPag.map((c, index) => (
                                        <div key={index} className="interaction-coment-item" >
                                            <div className="interaction-coment-box">
                                                <p className="interaction-coment-text"
                                                    variant='light'>{c.user}</p>
                                                <p>{c.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>,
                            "interaction":
                                <>
                                    <h5>Comentarios:</h5>
                                    <ul className="interaction-coment-list">
                                        {commentsPag.map((c, key) => (
                                            <li
                                                className="interaction-coment-item"
                                                key={key}>
                                                <div className="interaction-coment-box">
                                                    <p
                                                        className="interaction-coment-text"
                                                        variant='light'>
                                                        {`${c.user.name} ${c.user.last_name}`}:
                                                    </p>
                                                    <p>{c.comment.comment}</p>
                                                    <hr/>
                                                    {c.answers && c.answers.length > 0 ?
                                                        <div className="d-flex justify-content-end">                                                            
                                                            <p><strong>RSP: </strong>{c.answers[0].comment}</p>
                                                        </div>
                                                        : usuario && userService && usuario.id === userService.id ?
                                                            <div className="d-flex justify-content-end">
                                                                <Button className="interaction-button">
                                                                    Responder...
                                                                </Button>
                                                            </div>
                                                            : ""}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                        }[origin]
                        }
                    </div>
                    <Pagination count={comments.length} limit={limit} page={page} setPage={setPage} />
                </>
            ) :
                <h5>Aun no hay comentarios para esta publicacion</h5>
            }

        </div>
    )
}

export default Comments