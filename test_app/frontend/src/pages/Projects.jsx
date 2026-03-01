import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Projects = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [newPatient, setNewPatient] = useState({
    title: '',
    description: '',
    category: 'General Medicine',
    goal: '',
    progress: 0,
    location: ''
  });
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/projects");
        setPatients(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients: ', error);
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const departments = [
    'All', 'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 
    'Neurology', 'Oncology', 'Emergency', 'Radiology', 'Surgery'
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || patient.category === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleRegisterPatient = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newPatient.title || !newPatient.description || !newPatient.location || !newPatient.goal) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const ageValue = Number(newPatient.goal);
    if (Number.isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
      setFormError('Please enter a valid age (1-120).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...newPatient,
        goal: ageValue,
        progress: Number(newPatient.progress) || 0
      };
      const res = await api.post('/projects', payload);
      setPatients((prev) => [res.data, ...prev]);
      setNewPatient({
        title: '',
        description: '',
        category: 'General Medicine',
        goal: '',
        progress: 0,
        location: ''
      });
      setFormSuccess('Patient registered successfully. Medical Record Number: MRN-' + String(res.data.id).padStart(6, '0'));
    } catch (error) {
      console.error('Error registering patient: ', error);
      setFormError('Could not register patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">
          Patient Registration
        </h1>
        <p className="lead text-muted">
          Register new patients and manage existing records
        </p>
      </div>
      
      <div className="mb-4">
        <Row className="g-3 align-items-center">
          <Col md={6}>
            <Form.Control
              type="search"
              placeholder="Search patients by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
          </Col>
          
          <Col md={4}>
            <Form.Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Form.Select>
          </Col>
          
          <Col md={2}>
            <Button variant="outline-primary" size="sm" disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </Col>
        </Row>
      </div>

      <Card className="mb-5 border-0 shadow-sm bg-light">
        <Card.Body>
          <Card.Title className="fw-bold mb-3">
            <i className="fas fa-user-plus me-2"></i>
            New Patient Registration
          </Card.Title>
          <Form onSubmit={handleRegisterPatient}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  value={newPatient.title}
                  onChange={(event) => setNewPatient({ ...newPatient, title: event.target.value })}
                  placeholder="John Doe"
                />
              </Col>
              <Col md={3}>
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="120"
                  value={newPatient.goal}
                  onChange={(event) => setNewPatient({ ...newPatient, goal: event.target.value })}
                  placeholder="35"
                />
              </Col>
              <Col md={3}>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={newPatient.progress}
                  onChange={(event) => setNewPatient({ ...newPatient, progress: event.target.value })}
                >
                  <option value="0">Male</option>
                  <option value="25">Female</option>
                  <option value="50">Other</option>
                  <option value="75">Prefer not to say</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Department *</Form.Label>
                <Form.Select
                  value={newPatient.category}
                  onChange={(event) => setNewPatient({ ...newPatient, category: event.target.value })}
                >
                  {departments.filter((d) => d !== 'All').map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Room/Location *</Form.Label>
                <Form.Control
                  value={newPatient.location}
                  onChange={(event) => setNewPatient({ ...newPatient, location: event.target.value })}
                  placeholder="Room 301, Building A"
                />
              </Col>
              <Col md={12}>
                <Form.Label>Medical Condition / Notes *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newPatient.description}
                  onChange={(event) => setNewPatient({ ...newPatient, description: event.target.value })}
                  placeholder="Describe patient's condition, symptoms, and reason for visit..."
                />
              </Col>
            </Row>
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mt-4">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Registering...' : 'Register Patient'}
              </Button>
              {formError && <span className="text-danger">{formError}</span>}
              {formSuccess && <span className="text-success">{formSuccess}</span>}
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <h3 className="fw-bold mb-3">Registered Patients</h3>
      <Row className="g-4">
        {loading ? (
          <Col className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        ) : filteredPatients.length === 0 ? (
          <Col className="text-center">
            <p className="lead text-muted">
              No patients found matching your criteria.
            </p>
          </Col>
        ) : (
          filteredPatients.map((patient) => (
            <Col md={4} key={patient.id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h5 fw-bold mb-0">
                      {patient.title}
                    </Card.Title>
                    <span className="badge bg-primary">MRN-{String(patient.id).padStart(6, '0')}</span>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    {patient.category}
                  </Card.Subtitle>
                  <Card.Text className="text-muted mb-3">
                    Age: {Math.floor(patient.goal)} | {patient.location}
                  </Card.Text>
                  <Card.Text className="small text-muted">
                    {patient.description.substring(0, 100)}...
                  </Card.Text>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Treatment Progress</span>
                      <span className="fw-bold small">{patient.progress.toFixed(0)}%</span>
                    </div>
                    <div className="progress mt-2" style={{ height: '4px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${patient.progress}%` }}
                      >
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/projects/${patient.id}`)}>
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Projects;
