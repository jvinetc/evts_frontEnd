//import { useMediaQuery } from 'react-responsive';
import { FixedSizeList as List } from 'react-window';
import { Card, Button, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table'
//import { useState } from 'react';
import '../styles/DinamicTable.css'
import { FileExcel, Pencil, Trash } from 'react-bootstrap-icons';
import { useState } from 'react';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const DinamicTable = ({ stops, viewModal, setFormData, setNombreComuna, setNombreServicio, setIsUpdate,
    deleteStop, setLoading, comunas, showModal, usuario, setCreateStop }) => {

    //const isMobile = useMediaQuery({ maxWidth: 500 });
    const [selectedFile, setSelectedFile] = useState('');
    const [isXlsx, setIsXlsx] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8
    })
    const url = import.meta.env.VITE_SERVER;
    const token = sessionStorage.getItem('token');
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
                const ocultarBotones = ['delivery', 'delivered'].includes(stop.status);
                return ocultarBotones ? null : (
                    <div>
                        <Pencil size={24} className='icon-nav' onClick={() => {
                            setForm(stop)
                            viewModal()
                        }} />
                        <Trash size={24} className='icon-nav' onClick={() => deleteStop(stop)} />
                    </div>
                )
            }
        }

    ]

    const table = useReactTable({
        data: stops,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination }
    })

    const getCellStyle = (stop) => {
        switch (stop.status) {
            case 'delivery':
                return 'table-warning';
            case 'pickUp':
                return 'table-danger';
            case 'delivered':
                return 'table-success';
            default:
                return '';
        }
    };

    const setForm = (stop) => {
        setFormData({
            id: stop.id,
            addresName: stop.addresName,
            addres: stop.addres,
            comunaId: stop.Comuna.id,
            notes: stop.notes,
            rateId: stop.Rate.id,
            phone: stop.phone
        })
        setNombreComuna(stop.Comuna.name);
        setNombreServicio(stop.Rate.nameService);
        setIsUpdate(true);
        viewModal();
    }
    const validateExcelData = (data) => {
        return data.filter(row =>
            row.direccion?.trim() &&
            row.cliente?.trim() &&
            row.comuna?.trim() &&
            typeof row.telefono === 'number'
        );
    };

    const downloadExcelTemplate = () => {
        const headers = ['direccion', 'cliente', 'comuna', 'telefono', 'referencias'];

        // Crea hoja con headers y una fila vacía
        const worksheet = xlsx.utils.aoa_to_sheet([headers]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');

        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'Plantilla_Stops.xlsx');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        const file = selectedFile;
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const data = new Uint8Array(evt.target?.result);
                const workbook = xlsx.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const raw = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                const validated = validateExcelData(raw);
                const validData = validated.map(item => {
                    const id = comunas.findIndex((comuna) => comuna.name.trim().toLowerCase() === item.comuna.trim().toLowerCase());
                    const notes =typeof item.referencias === 'string' ? item.referencias.replace(/[()]/g, "") : '';
                    const phone= item.telefono.toString();
                    const comunaId= id < 0 ? 53:id;
                    return ({
                        addresName: item.cliente,
                        addres: item.direccion,
                        comunaId,
                        notes,
                        rateId: 1,
                        phone: phone,
                        sellId: usuario.Sells[0].id
                    })
                });
                const Authorization = { headers: { Authorization: `Bearer ${token}` } };
                axios.post(`${url}/stop/byExcel`, validData, Authorization)
                    .then(({ status }) => {
                        if (status === 201) {
                            showModal('Registros creados satisfactoriamente');
                        }
                        setIsXlsx(false);
                        setCreateStop(false);
                    })
                    .catch(({ response }) => {
                        console.log(response.data.message);
                        showModal(response.data.message);
                    })
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {stops.length > 0 ?
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table className="table table-hover table-bordered" style={{ width: '100%', margin: 0 }}>
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
                                <tr key={row.id} className={getCellStyle(row.original)}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} style={{
                                            maxWidth: '20px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            padding: '0.5rem',
                                        }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> : <p>Aun no tiene paradas creadas</p>}
            {/* 📌 Botones fijos */}
            <Row className="mb-3 justify-content-center" >
                <Col xs={6}>
                    <Button variant="success" className="w-100" onClick={viewModal}>
                        Crear stopio
                    </Button>
                </Col>
                <Col xs={6} className='d-flex'>
                    <Button variant="primary" className="w-100" onClick={() => setIsXlsx(true)}>
                        Cargar Excel📄
                    </Button>
                    <Button variant="warning" className="w-100" onClick={downloadExcelTemplate}>
                        Descargar plantilla 📄
                    </Button>
                </Col>
            </Row>
            <Modal show={isXlsx} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-info fw-bold">Carga aqui tu excel</Modal.Title>
                </Modal.Header>
                <Form>
                    <Form.Control
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <Button onClick={handleUpload} className="mt-3">
                        Subir Excel
                    </Button>
                </Form>
            </Modal>
        </>

    )
}

export default DinamicTable