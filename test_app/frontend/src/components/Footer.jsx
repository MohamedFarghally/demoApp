import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-4">
      <Container>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <h5>MediCare Portal</h5>
            <p className="text-muted">
              Comprehensive patient management system for modern healthcare facilities.
            </p>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled text-muted">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/projects">Patients</Link></li>
              <li><Link to="/donations">Records</Link></li>
              <li><Link to="/volunteers">Appointments</Link></li>
              <li><Link to="/stats">Analytics</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li><a href="mailto:support@medicare-portal.com">support@medicare-portal.com</a></li>
              <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
              <li>Emergency: 911</li>
            </ul>
          </div>
        </div>
        
        <hr />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted mb-0">
              &copy; 2026 MediCare Portal. All rights reserved. 
              <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
