import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const initialState = {
	clave:'',
	password:'',
}
const Login = () => {
	const [profesor, setProfesor] = useState(initialState);
	const { clave, password } = profesor;

  const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } =e.target;
		setProfesor({
			...profesor, [name]:value
		});
	}
	const handleSubmit = async (e) => {
    e.preventDefault();

		const formData =  new FormData();

    formData.append('clave', profesor.clave);
    formData.append('password', profesor.password);

    await axios
      .post("http://localhost:5000/profesores/acceder", formData)
      .then(function (response) {
        // handle success
        // console.log(response);
        notify(response.data.status, response.data.mensaje);
        setProfesor(initialState);  
        if(response.data.auth) {
          localStorage.setItem('token', response.data.resultado.token);
          // localStorage.getItem('token'); - removeItem(key) - clear()
        }else {
          localStorage.removeItem('token');
        }      
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
		
	}
  function notify(num, mensaje) {
    if(num===200) {
      toast.success(
        mensaje,
        {
          position: toast.POSITION.TOP_CENTER,
          onClose:() => {
            navigate('/profesores/home');
            // traerDatos();
          },
          autoClose:1000,
          theme: "dark",
        },
      );
    }
    if(num===101 || num===102 || num===103 || num===401) {
      toast.error(
        mensaje,
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
    <Container>
      <Row>
        <Col>
            <ToastContainer />
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Form onSubmit={ handleSubmit }>
            <Form.Group className="mb-3" controlId="formClave">
              <Form.Label>Clave</Form.Label>
              <Form.Control name='clave' onChange={ handleChange } type="text" placeholder="Ingresa Clave" value={ clave } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control name='password' onChange={ handleChange } type="password" placeholder="Ingresa Password" value={ password } />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
export default Login;