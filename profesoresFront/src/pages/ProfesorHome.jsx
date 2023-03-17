import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const initialState = {
	clave:'',
	nombres:'',
	apellidos:'',
	fnacimiento:'',
	email:'',
	sexo:'',
	estadocivil:'',
	tcasa:'',
	tcelular:'',
	curp:'',	
	calle:'',
	colonia:'',
	cp:'',
	municipio:'',
	estado:'',
	estatus:'',
	password:'',
	foto:'',
}
const ProfesorHome = () => {
	const [profesor, setProfesor] = useState(initialState);
	const { clave, nombres, apellidos, fnacimiento, email, sexo, estadocivil, tcasa, tcelular, curp, calle, colonia, cp, municipio, estado, estatus, password, foto } = profesor;

	const navigation = useNavigate();

	useEffect(() => {
		traerProfesor();
	}, []);

	const traerProfesor = () => {
    axios
      .get("http://localhost:5000/profesor/traer/token",{
		headers:{
			'x-access-token':localStorage.getItem('token')
		}
	  })
      .then(function (response) {
        // handle success
        // console.log(response);
		setProfesor(response.data.result[0]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  const handleSalir = ()=> {
	localStorage.removeItem('token');
	navigation('/');
  }
	
  return (
	<Container>
		<Row>
			<Col>
				<p className='h1'>Bienvenido</p>
			</Col>
		</Row>
		<Row className='mt-3' style={{backgroundColor:'#2C3E50', color:'white'}}>
			<Col>Clave</Col>
			<Col>Nombre</Col>
			<Col>Apellidos</Col>
			<Col>Fecha de nacimiento</Col>
		</Row>
		<Row style={{backgroundColor:'#ABB2B9', color:'white'}}>
			<Col>{clave}</Col>
			<Col>{nombres}</Col>
			<Col>{apellidos}</Col>
			<Col>{fnacimiento}</Col>
		</Row>
		<Row className='mt-3' style={{backgroundColor:'#2C3E50', color:'white'}}>
			<Col>Correo electronico</Col>
			<Col>Sexo</Col>
			<Col>Estado civil</Col>
			<Col>Telefono de casa</Col>
			<Col>Telefono movil</Col>
		</Row>
		<Row style={{backgroundColor:'#ABB2B9', color:'white'}}>
			<Col>{email}</Col>
			<Col>{sexo}</Col>
			<Col>{estadocivil}</Col>
			<Col>{tcasa}</Col>
			<Col>{tcelular}</Col>
		</Row>
		<Row className='mt-3' style={{backgroundColor:'#2C3E50', color:'white'}}>
			<Col>CURP</Col>
			<Col>Calle</Col>
			<Col>Colonia</Col>
			<Col>Codigo postal</Col>
		</Row>
		<Row style={{backgroundColor:'#ABB2B9', color:'white'}}>
			<Col>{curp}</Col>
			<Col>{calle}</Col>
			<Col>{colonia}</Col>
			<Col>{cp}</Col>
		</Row>
		<Row className='mt-3' style={{backgroundColor:'#2C3E50', color:'white'}}>
			<Col>Municipio</Col>
			<Col>Estado</Col>
		</Row>
		<Row style={{backgroundColor:'#ABB2B9', color:'white'}}>
			<Col>{municipio}</Col>
			<Col>{estado}</Col>
		</Row>
		<Row>
			<Col>
			<Image
				src={`http://localhost:5000/img/${foto}`}
				width="200"
				height="200"
				roundedCircle={true}
				className='mt-3'
			/>
			</Col>
		</Row>
		<Row>
			<Col>
				<Button
				variant="dark"
				className='mt-3'
				onClick={ handleSalir }
				>
					Salir
				</Button>
			</Col>
		</Row>
	</Container>
  )
}

export default ProfesorHome;