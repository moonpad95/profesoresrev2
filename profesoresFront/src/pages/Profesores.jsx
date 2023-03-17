import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profesores = () => {
  const initialState = {
    show: false,
    clave:'',
    nombres:'',
    apellidos:'',
  }
	const [datos, setDatos] = useState([]);
  const [show, setShow] = useState(initialState);

	useEffect(() => {
		traerDatos();
	}, []);
	const navigate = useNavigate();

	const traerDatos = async () => {

		await axios
      .get("http://localhost:5000/profesores")
      .then(function (response) {
        // handle success
        setDatos(response.data.result);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

	};
  const handleClose = () => {
    setShow(initialState);
  };
  const handleEliminar = (clave, nombres, apellidos) => {
    const initialState = {
      show: true,
      clave,
      nombres,
      apellidos,
    }
    setShow(initialState);
  };
  const handleEliminar2 = (clave) => {
    axios
      .get(`http://localhost:5000/profesor/eliminar/${clave}`)
      .then(function (response) {
        // console.log(response);
        if(response.data.result.affectedRows>0) {
          notify(response.status);
          traerDatos();
          setShow(initialState);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  function notify(num) {
    if(num===200) {
      toast.success(
        'Profesor Eliminado',
        {
          position: toast.POSITION.TOP_CENTER,
          onClose:() => {
            // traerDatos();
          },
          autoClose:1000,
          theme: "dark",
        },
      );
    }
  }
	
  return (
    <Container className="mt-5">
      <Row>
        <Col>
            <ToastContainer />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>email</th>
                <th>CURP</th>
                <th>Tel. movil</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((prof) => (
                <tr key={prof.clave}>
                  <td>{prof.clave}</td>
                  <td>
                    {prof.nombres} {prof.apellidos}
                  </td>
                  <td>{prof.email}</td>
                  <td>{prof.curp}</td>
                  <td>{prof.tcelular}</td>
                  <td>{prof.estatus}</td>
                  <td>
                    <Button
                      onClick={() =>
                        navigate(`/profesores/modificar/${prof.clave}`)
                      }
                      variant="primary"
                      className="me-3"
                    >
                      Modificar
                    </Button>
                    <Button variant="danger" onClick={ ()=> handleEliminar(prof.clave, prof.nombres, prof.apellidos) }>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Modal show={ show.show } onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{
                  `${show.clave} - ${show.nombres} ${show.apellidos}`
                }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estas seguro de que quieres eliminar a este profesor?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={()=>handleEliminar2(show.clave)}>
                SI
              </Button>
              <Button variant="success" onClick={handleClose}>
                NO
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Profesores;