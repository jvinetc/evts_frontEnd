
import { Pagination } from 'react-bootstrap';

const Paginator = ({ count, limit, page, setPage }) => {
    const number = Math.ceil(count / limit);
    const items = [];
    for (let i = 1; i <= number; i++) {
        items.push(
            <Pagination.Item key={i} active={i === page} onClick={(e) => handlePage(e)}>
                {i}
            </Pagination.Item>,
        );
    }
    const handleNext = () => {
        setPage(page + 1);
    }
    const handlePrev = () => {
        setPage(page - 1);
    }
    const handlePage = (e) => {
        const nPage = Number(e.target.text);
        setPage(nPage);
    }
    return (
        <div>
            <Pagination>
                {page > 1 ?
                    <Pagination.Prev onClick={handlePrev} />
                    : ""
                }
                {items}
                {page < number ?
                    <Pagination.Next onClick={handleNext} />
                    : ""}
            </Pagination>
        </div>
    )
};

export default Paginator;