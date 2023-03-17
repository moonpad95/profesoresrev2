import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row, Col, Image, Carousel, Modal} from 'react-bootstrap';
import axios from "axios";

const initialState = '';
const initialStateProfesor = {
	id:'',
	foto:'',
}
const ProfesorFoto = () => {

	const [album, setAlbum] = useState([{foto: ''}])
	const [archivoAlbum, setArchivoAlbum] = useState('')
	const [archivo, setArchivo] = useState(initialState);
	const [profesor, setProfesor] = useState(initialStateProfesor);



	const [show, setShow] = useState({
		show: false,
		id: '',
		name: ''
	})

	const { clave, foto } = profesor;

	useEffect(() => {
		traerProfesor()
	}, [])

	useEffect(() => {
		traerAlbum()
	}, [profesor])

	const traerProfesor = () => {
		axios
		.get("http://localhost:5000/profesor/traer/token",{
		  headers:{
			  'x-access-token':localStorage.getItem('token')
		  }
		})
		.then(function (response) {
		  setProfesor(response.data.result[0]);
		})
		.catch(function (error) {
		  // handle error
		  console.log(error);
		});
	}
	const traerAlbum = () =>{
		axios.get(`http://localhost:5000/album/${clave}`).then(response =>{ if(response.data.result) setAlbum(response.data.result)})
	}
	
	
	const handleChange = async(e) => {
		setArchivo(e.target.files[0]);
	}

	const handleChangeAlbum = (e) =>{
		setArchivoAlbum(e.target.files[0])
	}

	const handleSubmitAlbum = async (e) =>{
		e.preventDefault()
		if(!archivoAlbum) {
			return(
				alert('selecciona archivo')
			)
		}

		const formData = new FormData();
		formData.append('clave', clave);
		formData.append('archivoAlbum', archivoAlbum);

		await axios
      .post("http://localhost:5000/profesor/album/subir", formData)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
	  })
	  traerAlbum()

	}

	const handleSubmit = async (e) => {

		e.preventDefault();
		if(!archivo) {
			return(
				alert('selecciona archivo')
			)
		}
		const formData = new FormData();
		formData.append('clave', clave);
		formData.append('foto', foto);
		formData.append('archivo', archivo);

		const config = {
			headers:{
				'x-access-token':localStorage.getItem('token')
			}
		}

		await axios
      .post("http://localhost:5000/profesor/foto/subir", formData, config)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
	  traerProfesor()
	}

	const handleModal = (id, name) => {
		setShow({
			show: true,
			id: id,
			name: name
		});
	};
	const handleClose = () =>{
		setShow({
			show: false,
			id: '',
			name: ''
		})
	}
	const handleEliminar = async(id, name) =>{

		const formData = new FormData()
		formData.append('name', name)

		await axios.delete(`http://localhost:5000/album/eliminar/${id}`, formData).then(response => console.log(response)).catch(err => console.error(err))
		traerAlbum()
		handleClose()
	} 



	const albumItems = album.length > 0 
	? (
		album.map(img => (
			< Image rounded 
				key={img.foto}
				onClick={()=>handleModal(img.id, img.foto)}
				className='border shadow-sm m-4 album-item'
				style={{maxHeight: '20rem', maxWidth: '30rem'}}
				src={`http://localhost:5000/img/${img.foto}`}
				alt={img.foto}
			/>
		))
	)
	: ''

	console.log(album)

  return (
    <Container>
      <Row className='mt-5'>
        <Col>
		{/* antiguo */}
		<p className='h4'>Avatar actual</p>
			<Image
			style={{width:'50%', height:'60%', verticalAlign:'center'}}
			variant='top'
			roundedCircle={true}
			src={`http://localhost:5000/img/${ foto }`}
		/>

		
		</Col>
        <Col>
          {/* nuevo */}
		 {
			archivo!==''
			? (
				<Image
				style={{width:'50%', height:'50%', verticalAlign:'center'}}
				variant='top'
				roundedCircle={true}
				src = { URL.createObjectURL(archivo) }
			  />
			)
			:
			''
		 }
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="h3 mb-4">Selecciona imagen</Form.Label>
              <Form.Control
			  	accept='image/*'
                name="archivo"
                type="file"
                size="lg"
                onChange={handleChange}
              />
            </Form.Group>
            <Button type='submit' variant="light">Subir</Button>
          </Form>
        </Col>
      </Row>
	  <Row>
		<h3 className='text-center mb-4'>Album de imágenes</h3>
		<Container className='p-4 border rounded shadow-sm my-4 mb-5'>
			{albumItems}
		</Container>
		<Form onSubmit={handleSubmitAlbum} className={album.length >=5 && 'd-none'}>
            <Form.Group className="my-4">
              <Form.Label className="h3 mb-4">Agregar imagen al album</Form.Label>
              <Form.Control
			  	accept='image/*'
                name="archivoAlbum"
                type="file"
                size="lg"
                onChange={handleChangeAlbum}
              />
            </Form.Group>
            <Button type='submit' variant="light" className='mb-5'>Subir</Button>
        </Form>
	  </Row>
	  
	  <Modal show={show.show}>
		<Modal.Header>{show.name}</Modal.Header>
	  	<Modal.Body>
              ¿Estas seguro de que quieres eliminar esta imagen?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose} >
                NO
              </Button>
              <Button variant="success" onClick={()=>handleEliminar(show.id, show.name)}>
                SI
              </Button>
            </Modal.Footer>
	  </Modal>
    </Container>
  );
}

export default ProfesorFoto;
