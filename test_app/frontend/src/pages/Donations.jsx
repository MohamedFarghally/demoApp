import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const [recordsRes, patientsRes] = await Promise.all([
          api.get("/donations"),
          api.get("/projects")
        ]);
        
        // Map donations as medical records
        const recordsWithPatients = recordsRes.data.map(record => {
          const patient = patientsRes.data.find(p => p.id === record.project_id);
          return {
            ...record,
            patientName: patient ? patient.title : 'Unknown Patient',
            patientMRN: patient ? `MRN-${String(patient.id).padStart(6, '0')}` : 'N/A',
            department: patient ? patient.category : 'General'
          };
        });
        
        setRecords(recordsWithPatients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records: ', error);
        setLoading(false);
      }
    };
    
    fetchRecords();
  }, []);

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">
          Medical Records
        </h1>
        <p className="lead text-muted">
          Patient medical history and treatment records
        </p>
      </div>
      
      <Row className="g-4">
        {loading ? (
          <Col className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        ) : records.length === 0 ? (
          <Col className="text-center">
            <p className="lead text-muted">
              No medical records found. Records are created when you register patient visits.
            </p>
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Register Patient
            </Button>
          </Col>
        ) : (
          records.map((record) => (
            <Col md={6} key={record.id}>
              <Card className="h-100 border-primary">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{record.patientName}</span>
                    <span className="badge bg-light text-primary">{record.patientMRN}</span>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="mb-2">
                    <strong>Department:</strong> {record.department}
                  </p>
                  <p className="mb-2">
                    <strong>Visit Date:</strong> {new Date(record.created_at).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <strong>Treatment Value:</strong> ${record.amount.toFixed(2)}
                  </p>
                  
                  {record.message && (
                    <Card className="bg-light border-0 mt-3">
                      <Card.Body className="py-2">
                        <p className="mb-0 text-muted">
                          <strong>Doctor's Notes:</strong><br/>
                          {record.message}
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <small className="text-muted">
                    Recorded by: {record.donor_name}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <div className="text-center mt-5">
        <h3 className="fw-bold mb-3">Need to Add a Record?</h3>
        <Button variant="primary" size="lg" onClick={() => navigate('/projects')}>
          Go to Patient Registration
        </Button>
      </div>
    </Container>
  );
};

export default MedicalRecords;
