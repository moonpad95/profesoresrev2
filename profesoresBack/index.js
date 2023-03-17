const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const port = 5000;
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rDñ';

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.use('/img', express.static(__dirname + '/imagenes'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "tutorias1",
  password: "",
});

// 	user: "tutorias_user",
//   password: "b)G6GPq)ZcqCtmP!",

app.get('/',(req,res) => {
	res.send('Hola mundo!!!');
});

app.post('/profesores/agregar', (req, res)=> {
	const {
		clave,
		nombres,
		apellidos,
		fNacimiento,
		email,
		sexo,
		estadoCivil,
		tCasa,
		curp,
		tCelular,
		calle,
		colonia,
		cp,
		municipio,
		estado,
		password,
	} = req.body;

	bcrypt.hash(password, saltRounds, (err, hash) => {
    const sql =
      "INSERT INTO profesores (clave, nombres, apellidos, fnacimiento, email,	sexo, estadocivil, tcasa, curp, tcelular, calle, colonia, cp, municipio, estado, estatus, password,foto) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(
      sql,
      [
        clave,
        nombres,
        apellidos,
        new Date(fNacimiento),
        email,
        sexo,
        estadoCivil,
        tCasa,
        curp,
        tCelular,
        calle,
        colonia,
        cp,
        municipio,
        estado,
        "inactivo",
		hash,
		'default.png',
      ],
      (err, result) => {
        if (err) {
          res.send({
            status: 100,
            errNo: err.errno,
            mensaje: err.message,
            codigo: err.code,
          });
        } else {
          res.send({
            status: 200,
            resultado: result,
          });
        }
      }
    );
  });
	
});
app.get('/profesores', (req, res)=>{
	const sql = 'SELECT * FROM profesores';
	db.query(sql, (err,result, fields)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	});
});
app.post('/profesores/modificar', (req, res)=>{
	console.log(req.body);
	const { clave, nombres,	apellidos, fNacimiento,	email, sexo, estadoCivil, tCasa, curp, tCelular, calle, colonia, cp, municipio, estado } = req.body;
	const sql = "UPDATE profesores SET nombres=?, apellidos=?, fnacimiento=?, email=?, sexo=?, estadocivil=?, tcasa=?, curp=?, tcelular=?, calle=?, colonia=?, cp=?, municipio=?, estado=? WHERE clave=?";
	db.query(sql, [nombres,	apellidos, fNacimiento,	email, sexo, estadoCivil, tCasa, curp, tCelular, calle, colonia, cp, municipio, estado, clave], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:err,
			});
		}
	})
});
app.get('/profesor/:clave',(req,res)=>{
	const {clave} = req.params;

	const sql = 'SELECT * from profesores WHERE clave = ?';
	db.query(sql, [clave], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	})

});
app.get('/profesor/eliminar/:clave', (req, res)=>{
	const {clave} = req.params;

	const sql = 'DELETE FROM profesores WHERE clave = ?';
	db.query(sql, [clave], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	});
});
app.post('/profesores/acceder', (req, res)=>{
	const { clave, password } = req.body;

	sql = 'SELECT * FROM profesores WHERE clave = ?';
	db.query(sql, [clave], (err, result)=>{
		if(err) {
			return(
				res.send({
					status:401,
					auth:false,
					err,
					mensaje:'Problemas con el servidor - contacte al administrador',
				})
			)
		}
		if(result.length>0){

			bcrypt.compare(password, result[0].password, (err1, result1) => {
				if(err1) {
					return(
						res.send({
							status:102,
							auth:false,
							err1,
							mensaje:'Problemas con el servidor - contacte al administrador',
						})
					)
				}
				if(result1) {
					const clave = result[0].clave;
					const nombres = result[0].nombres;
					const apellidos = result[0].apellidos;
					const estatus = result[0].estatus;
					const foto = result[0].foto;
					const token = jwt.sign({clave}, myPlaintextPassword, {
						expiresIn:"1 day",
					});
					res.send({
						status:200,
						auth:true,
						resultado:{clave, nombres, apellidos, estatus, foto, token},
						mensaje:'Datos correctos',
					});

				}else {
					res.send({
						status:103,
						auth:false,
						mensaje:'Password incorrecto',
					})

				}
			})



		}else {
			res.send({
				status:101,
				auth:false,
				result,
				mensaje:'El usuario no existe',
			})
		}
	});
});
const verifyToken = (req, res, next) => {
	const token = req.headers["x-access-token"] ? req.headers["x-access-token"] : '';
	jwt.verify(token, myPlaintextPassword, (err, decoded)=>{
		if (!err) {
			req.clave = decoded.clave;
			req.auth = true;
			next();
		}else {
			res.send({
				status:100,
				auth:false,
				err,
				mensaje:'no estas autentificado'
			})
		}
	})

};
app.get('/profesor/traer/token', verifyToken, (req,res)=>{
	const { clave } = req;
	const sql = 'SELECT * from profesores WHERE clave = ?';
	db.query(sql, [clave], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	})
});
app.post('/profesor/foto/subir', (req, res)=>{
	const file = req.files;
	const { clave, foto } = req.body;
	const mensaje = eliminarFoto(foto)
	// res.status(200).send(mensaje);
	if(!file || Object.keys(file).length === 0){
		return(
			res.status(101).send({
				mensaje: 'no se adjunto la fotografía'
			})
		)
	}
	const archivo = file.archivo;
	const nombreArchivo = clave+path.extname(archivo.name);
	const nombreArchivo2 = (foto===nombreArchivo) ? clave + '_1' + path.extname(archivo.name) : nombreArchivo;
	const uploadPath = __dirname + '/imagenes/' + nombreArchivo2;
	archivo.mv(uploadPath, (err) => {
		if(err){
			return(
				res.status(101).send({
					mensaje: 'No fue posible subir la fotografía -contacta al administrador'
				})
			)
		}
		const sql = 'UPDATE profesores SET foto = ? WHERE clave = ?';
		db.query(sql, [nombreArchivo2, clave], (err1, result1) => {
			if(err1){
				return(
					res.status(102).send({
						mensaje: 'se ha subido la fotografía',
						mensajeFoto: 'no fue posible actualizar la base de datos -contacte al administrador',
						resultado: err1,
					})
				)
			}
			if(result1.affectedRows>0){
				return(
					res.status(200).send({
						mensaje: 'se ha subido la fotografía',
						mensajeFoto: 'se actualizo la base de datos',
						resultado: result1,
					})
				)
			}else{
				res.status(103).send({
					mensaje: 'se ha subido la fotografía',
					mensajeFoto: 'no fue posible actualizar la base de datos -contacte al administrador',
					resultado: result1,
				})
			}
		});
	})
});

app.post('/profesor/album/subir', (req, res)=>{
	const file = req.files;
	const {clave} = req.body;
	// const mensaje = eliminarFoto(foto)
	// res.status(200).send(mensaje);
	if(!file || Object.keys(req.files).length === 0){
		return(
			res.status(101).send({
				mensaje: 'no se adjunto la fotografía'
			})
		)
	}
	const archivoAlbum = req.files.archivoAlbum;
	const nombreArchivo = archivoAlbum.name
	const uploadPath = __dirname + '/imagenes/' + nombreArchivo;
	archivoAlbum.mv(uploadPath, (err) => {
		if(err){
			return(
				res.status(101).send({
					mensaje: 'No fue posible subir la fotografía -contacta al administrador'
				})
			)
		}
		const sql = 'INSERT INTO album VALUES(?,?,?)';
		db.query(sql, ['NULL', nombreArchivo, clave], (err1, result1) => {
			if(err1){
				return(
					res.status(102).send({
						mensaje: 'se ha subido la fotografía',
						mensajeFoto: 'no fue posible actualizar la base de datos -contacte al administrador',
						resultado: err1,
					})
				)
			}
			if(result1.affectedRows>0){
				return(
					res.status(200).send({
						mensaje: 'se ha subido la fotografía',
						mensajeFoto: 'se actualizo la base de datos',
						resultado: result1,
					})
				)
			}else{
				res.status(103).send({
					mensaje: 'se ha subido la fotografía',
					mensajeFoto: 'no fue posible actualizar la base de datos -contacte al administrador',
					resultado: result1,
				})
			}
		});
	})
});

app.get('/album/:clave',(req,res)=>{
	const {clave} = req.params;

	const sql = 'SELECT foto, id from album WHERE clave_profesor = ?';
	db.query(sql, [clave], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	})

});

app.delete('/album/eliminar/:id',(req,res)=>{
	const {id} = req.params;
	const {name} = req.body

	const sql = 'DELETE from album WHERE id = ?';
	db.query(sql, [id], (err, result)=>{
		if(!err) {
			res.send({
				status:200,
				result,
			});
		}else {
			res.send({
				status:400,
				result:{},
			});
		}
	})
	const fs = require('fs')
	fs.unlink(`./imagenes/${name}`,(err)=>{
			if(err) {
				return (err);
			} 
			return ('archivo eliminado');
		})


});




function eliminarFoto (foto) {
	var fs = require('fs');
	fs.stat(`./imagenes/${foto}`, (err)=> {
		if(err || foto==='default.png') {
			return (err?err:'es default.png');
		}
		fs.unlink(`./imagenes/${foto}`,(err)=>{
			if(err) {
				return (err);
			} 
			return ('archivo eliminado');
		})

	})
}


app.all('*', (req,res)=>{
	res.send('Esta ruta no existe');
});

app.listen(port, ()=>{
	console.log(`Escuchando por el puerto ${port}`);
});