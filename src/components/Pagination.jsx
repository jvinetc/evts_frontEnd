
import { Pagination } from 'react-bootstrap';

const Paginator = ({ count, limit, page, setPage }) => {
    const number = Math.floor(count /limit);
    const items = [];
    for (let i = 1; i <= number; i++) {
        items.push(
            <Pagination.Item key={i} active={i === page} disabled={i === page} onClick={(e) => handlePage(e)}>
                {i}
            </Pagination.Item>,
        );
    }
    const handleNext = () => {
        setPage({
            pageIndex: page+1,
            pageSize: 8
        });
    }
    const handlePrev = () => {
        setPage({
            pageIndex: page-1,
            pageSize: 8
        });
    }
    const handlePage = (e) => {
        const nPage = Number(e.target.text);
        setPage({
            pageIndex: nPage,
            pageSize: 8
        });
    }
    return (
        <div>
            <Pagination>
                {page > 1 ?
                    <Pagination.Prev onClick={handlePrev} />
                    : ""
                }
                {items}
                {page < number-1 ?
                    <Pagination.Next onClick={handleNext} />
                    : ""}
            </Pagination>
        </div>
    )
};

export default Paginator;