//import { useMediaQuery } from 'react-responsive';
import { FixedSizeList as List } from 'react-window';
import { Card, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table'
//import { useState } from 'react';
import '../styles/DinamicTable.css'
import { Pencil, Trash } from 'react-bootstrap-icons';
import { useState } from 'react';

const DinamicTable = ({ stops, viewModal, isLoad, setFormData, setNombreComuna, setNombreServicio, setIsUpdate }) => {

    //const isMobile = useMediaQuery({ maxWidth: 500 });
    console.log(stops)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8
    })

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'addresName',
            header: 'Nombre'
        },
        {
            accessorKey: 'addres',
            header: 'Direccion'
        },
        {
            accessorKey: 'Comuna.name',
            header: 'Comuna'
        },
        {
            accessorKey: 'Rate.nameService',
            header: 'Servicio'
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => {
                const stop = row.original
                return (
                    <div>
                        <Pencil size={24} className='icon-nav' onClick={() => {
                            setForm(stop)
                            viewModal()
                        }} />
                        <Trash size={24} className='icon-nav' onClick={() => console.log('vas a borrar')} />
                    </div>
                )
            }
        }

    ]

    const table = useReactTable({
        data: [stops],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination }
    })

    const setForm = (stop) => {
        setFormData({
            id: stop.id,
            addresName: stop.addresName,
            addres: stop.addres,
            comunaId: stops.Comuna.id,
            notes: stop.notes,
            rateId: stop.Rate.id,
            phone: stop.phone
        })
        setNombreComuna(stop.Comuna.name);
        setNombreServicio(stop.Rate.nameService);
        setIsUpdate(true);
        viewModal();
    }
    return (
        <>
            {isLoad &&
                <table className="table table-hover table-bordered">
                    <thead className="table-light">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>}
            {/*  <div > */}
            {/* 🎛️ Filtros */}
            {/* <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar cliente..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Form.Select value={comuna} onChange={e => setComuna(e.target.value)}>
                    <option value="">Todas las comunas</option>
                    <option value="San Bernardo">San Bernardo</option>
                    <option value="Maipú">Maipú</option>
                    <option value="Puente Alto">Puente Alto</option>
                </Form.Select>
            </InputGroup> */}

            {/* 📋 Vista según dispositivo */}
            {/*  {!isLoad ? <h4>Aun no tienes deliverys creados</h4> :
                    !isMobile ? (
                        <BootstrapTable
                            keyField="id"
                            data={[stops]}
                            columns={columns}
                            pagination={paginationFactory({
                                sizePerPage: 8,
                                showTotal: true
                            })}
                        />
                    ) : (
                        <List
                            height={470}
                            itemCount={[stops].length}
                            itemSize={200}
                            width={'100%'}
                        >
                            {({ index, style }) => (
                                <div style={{ ...style, padding: '8px' }}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{[stops][index].addresName}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{[stops][index].addres}</Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted">{[stops][index].Comuna.name}</Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted">{[stops][index].Rate.nameService.toUpperCase()}</Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted">{[stops][index].phone}</Card.Subtitle>
                                            <Card.Text>Observaciones: {[stops][index].notes}</Card.Text>
                                            <Card.Text>Costo: ${[stops][index].Rate.price}</Card.Text>
                                            <Card.Footer className='d-flex justify-content-around'>
                                                <Pencil size={24} className='icon-nav' onClick={() => {
                                                    setFormData({
                                                        id: [stops][index].id,
                                                        addresName: [stops][index].addresName,
                                                        addres: [stops][index].addres,
                                                        comunaId: [stops][index].Comuna.id,
                                                        notes: [stops][index].notes,
                                                        rateId: [stops][index].Rate.id,
                                                        phone: [stops][index].phone
                                                    })
                                                    setNombreComuna([stops][index].Comuna.name);
                                                    setNombreServicio([stops][index].Rate.nameService);
                                                    setIsUpdate(true);
                                                    viewModal();
                                                }} />
                                                <Trash size={24} className='icon-nav' onClick={() => console.log('vas a borrar')} />
                                            </Card.Footer>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </List>
                    )} */}

            {/* 📌 Botones fijos */}
            <Row className="mb-3 justify-content-center" >
                <Col xs={6}>
                    <Button variant="success" className="w-100" onClick={viewModal}>
                        Crear stopio
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button variant="primary" className="w-100">
                        Cargar Excel
                    </Button>
                </Col>
            </Row>
            {/* </div> */}
        </>

    )
}

export default DinamicTable