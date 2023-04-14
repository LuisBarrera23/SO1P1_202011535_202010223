import React from 'react';
import logo from '../imas/gob.png';

const Footer = () => {
  return (
    <footer className="mt-5" style={{ backgroundColor: 'beige', padding: '20px' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
            <p>© 2023 Gobierno de Guatemala.</p>
            <p>Todos los Derechos Reservados</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Autores</h5>
            <p>Esteban Humberto Valdez Ennati</p>
            <p>Luis Angel Barrera Velasquez</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Siguenos</h5>
            <p>Facebook</p>
            <p>Twitter</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
