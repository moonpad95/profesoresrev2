import React from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {

  return (
	<Container>
		<Row>
			<Col><h1>Home</h1></Col>
		</Row>
		<Row>
			<Col>
			<Button as={Link} to='/profesores/ingresar' variant="secondary">
				Profesores
			</Button>			
			</Col>
			<Col>
			<Button>
			Alumnos

			</Button>
			</Col>
			<Col>
			<Button>
			Administrativos

			</Button>
			</Col>
		</Row>
		
	</Container>
  )
}

export default Home;