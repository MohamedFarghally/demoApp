import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center mb-5 py-5">
        <div className="mb-4">
          <i className="fas fa-hospital-alt fa-5x text-primary"></i>
        </div>
        <h1 className="display-3 fw-bold mb-3">
          MediCare Portal
        </h1>
        <p className="lead text-muted mb-4">
          Comprehensive Patient Management System for Modern Healthcare
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate('/projects')}>
            <i className="fas fa-user-plus me-2"></i>
            Register Patient
          </Button>
          <Button variant="outline-primary" size="lg" onClick={() => navigate('/projects')}>
            View Patients
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center hover-card">
            <Card.Body className="p-4">
              <div className="mb-3">
                <i className="fas fa-user-injured fa-3x text-primary"></i>
              </div>
              <h4 className="fw-bold mb-2">Patient Registration</h4>
              <p className="text-muted mb-3">
                Register new patients and manage their medical records
              </p>
              <Button variant="primary" onClick={() => navigate('/projects')} className="w-100">
                Go to Registration
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center hover-card">
            <Card.Body className="p-4">
              <div className="mb-3">
                <i className="fas fa-file-medical fa-3x text-success"></i>
              </div>
              <h4 className="fw-bold mb-2">Medical Records</h4>
              <p className="text-muted mb-3">
                Access and update patient medical history and treatments
              </p>
              <Button variant="success" onClick={() => navigate('/donations')} className="w-100">
                View Records
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center hover-card">
            <Card.Body className="p-4">
              <div className="mb-3">
                <i className="fas fa-calendar-alt fa-3x text-info"></i>
              </div>
              <h4 className="fw-bold mb-2">Appointments</h4>
              <p className="text-muted mb-3">
                Schedule and manage patient appointments and visits
              </p>
              <Button variant="info" onClick={() => navigate('/volunteers')} className="w-100 text-white">
                Schedule Visit
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Info Section */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-shield-alt text-primary me-2"></i>
                Secure & Compliant
              </h5>
              <p className="text-muted mb-0">
                Patient data is handled with the highest security standards. 
                Our system ensures HIPAA compliance and data protection for all medical records.
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-clock text-primary me-2"></i>
                24/7 Access
              </h5>
              <p className="text-muted mb-0">
                Access patient records anytime, anywhere. Our portal is always available 
                for authorized medical staff to provide continuous patient care.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
