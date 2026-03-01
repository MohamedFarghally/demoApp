import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [treatmentNote, setTreatmentNote] = useState({
    amount: '',
    donor_name: '',
    message: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setPatient(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient: ', error);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleAddTreatment = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    const costValue = Number(treatmentNote.amount);
    if (Number.isNaN(costValue) || costValue < 0) {
      setFormError('Please enter a valid treatment cost.');
      return;
    }

    if (!treatmentNote.donor_name) {
      setFormError('Please enter the doctor name.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        project_id: parseInt(id),
        amount: costValue,
        donor_name: treatmentNote.donor_name,
        message: treatmentNote.message
      };
      await api.post('/donations', payload);
      
      // Refresh patient data
      const res = await api.get(`/projects/${id}`);
      setPatient(res.data);
      
      setTreatmentNote({ amount: '', donor_name: '', message: '' });
      setFormSuccess('Treatment record added successfully!');
    } catch (error) {
      console.error('Error adding treatment: ', error);
      setFormError('Could not add treatment record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container className="py-5">
        <h2 className="fw-bold">Patient not found</h2>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Back to Patients
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/projects')}>
        ← Back to Patients
      </Button>

      <Row>
        <Col md={8}>
          <Card className="mb-4 border-primary">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Patient Record</h3>
                <span className="badge bg-light text-primary">MRN-{String(patient.id).padStart(6, '0')}</span>
              </div>
            </Card.Header>
            <Card.Body>
              <h2 className="fw-bold mb-3">{patient.title}</h2>
              <p className="text-muted mb-4">
                <strong>Department:</strong> {patient.category} | <strong>Location:</strong> {patient.location}
              </p>
              
              <Row className="mb-4">
                <Col md={6}>
                  <p><strong>Age:</strong> {Math.floor(patient.goal)} years</p>
                  <p><strong>Status:</strong> {patient.progress < 100 ? 'Under Treatment' : 'Treatment Complete'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Admission Date:</strong> {new Date(patient.created_at).toLocaleDateString()}</p>
                  <p><strong>Treatment Progress:</strong> {patient.progress.toFixed(0)}%</p>
                </Col>
              </Row>
              
              <div className="bg-light p-3 rounded">
                <h5 className="fw-bold">Medical Condition</h5>
                <p className="mb-0">{patient.description}</p>
              </div>
              
              <div className="mt-4">
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${patient.progress}%` }}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Add Treatment Record</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddTreatment}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Cost ($)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150.00"
                    value={treatmentNote.amount}
                    onChange={(e) => setTreatmentNote({ ...treatmentNote, amount: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dr. Smith"
                    value={treatmentNote.donor_name}
                    onChange={(e) => setTreatmentNote({ ...treatmentNote, donor_name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Treatment Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter treatment details, medications prescribed, test results..."
                    value={treatmentNote.message}
                    onChange={(e) => setTreatmentNote({ ...treatmentNote, message: e.target.value })}
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Treatment Record'}
                </Button>

                {formError && <p className="text-danger mt-2">{formError}</p>}
                {formSuccess && <p className="text-success mt-2">{formSuccess}</p>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetail;
