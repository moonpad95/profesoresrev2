import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, Outlet } from "react-router-dom";

const BarraSuperior = () => {
  return (
    <>
      <Navbar bg="primary" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Profesores
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <NavDropdown title="Profesores" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profesores">
                  Inicio
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profesores/agregar">
                  Agregar
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profesores/foto">
                  Modificar avatar
                </NavDropdown.Item>
                
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default BarraSuperior;