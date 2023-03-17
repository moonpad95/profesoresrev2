import { Routes, Route } from 'react-router-dom';
import './App.css';
import BarraSuperior from './components/BarraSuperior';
import ProfesoresAgregar from './components/ProfesoresAgregar';
import { ProfesoresModificar } from './components/ProfesoresModificar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profesores from './pages/Profesores';
import ProfesorFoto from './pages/ProfesorFoto';
import ProfesorHome from './pages/ProfesorHome';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BarraSuperior />}>
          <Route index element={ <Home /> } />
          <Route path="profesores">
            <Route index element={<Profesores />} />
            <Route path="agregar" element={<ProfesoresAgregar />} />
            <Route path='modificar/:c' element={ <ProfesoresModificar /> } />
            <Route path='ingresar' element={ <Login />} />
            <Route path='home' element={ <ProfesorHome />} />
            <Route path='foto' element={ <ProfesorFoto />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
