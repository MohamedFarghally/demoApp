import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import api from '../services/api';

const Volunteers = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [newAppointment, setNewAppointment] = useState({
    name: '',
    email: '',
    skills: '',
    availability: 'Morning'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes] = await Promise.all([
          api.get("/volunteers"),
          api.get("/projects")
        ]);
        
        // Map volunteers as appointments
        const appointmentsWithPatients = appointmentsRes.data.map(apt => {
          const patient = patientsRes.data.find(p => 
            p.title.toLowerCase().includes(apt.name.toLowerCase().split(' ')[0])
          );
          return {
            ...apt,
            patientName: patient ? patient.title : apt.name,
            patientMRN: patient ? `MRN-${String(patient.id).padStart(6, '0')}` : 'Walk-in',
            department: patient ? patient.category : 'General',
            appointmentTime: apt.availability,
            reason: apt.skills.join(', ')
          };
        });
        
        setAppointments(appointmentsWithPatients);
        setPatients(patientsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments: ', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSchedule = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newAppointment.name || !newAppointment.email || !newAppointment.skills) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: newAppointment.name,
        email: newAppointment.email,
        skills: newAppointment.skills.split(',').map(s => s.trim()).filter(s => s),
        availability: newAppointment.availability
      };
      const res = await api.post('/volunteers', payload);
      
      const newApt = {
        ...res.data,
        patientName: res.data.name,
        patientMRN: 'Pending',
        department: 'General',
        appointmentTime: res.data.availability,
        reason: res.data.skills.join(', ')
      };
      
      setAppointments((prev) => [newApt, ...prev]);
      setNewAppointment({
        name: '',
        email: '',
        skills: '',
        availability: 'Morning'
      });
      setFormSuccess('Appointment scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling appointment: ', error);
      setFormError('Could not schedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (time) => {
    const now = new Date().getHours();
    const timeMap = {
      'Morning': now < 12 ? 'success' : 'secondary',
      'Afternoon': now >= 12 && now < 17 ? 'success' : 'secondary',
      'Evening': now >= 17 ? 'success' : 'secondary',
      'Weekends': 'info'
    };
    return <Badge bg={timeMap[time] || 'secondary'}>{time}</Badge>;
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">
          Appointment Scheduling
        </h1>
        <p className="lead text-muted">
          Schedule and manage patient appointments
        </p>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm bg-light">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">
                <i className="fas fa-calendar-plus me-2"></i>
                Schedule New Appointment
              </Card.Title>
              <Form onSubmit={handleSchedule}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    value={newAppointment.name}
                    onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contact Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="patient@email.com"
                    value={newAppointment.email}
                    onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Reason for Visit *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Consultation, Follow-up, Lab work..."
                    value={newAppointment.skills}
                    onChange={(e) => setNewAppointment({ ...newAppointment, skills: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preferred Time</Form.Label>
                  <Form.Select
                    value={newAppointment.availability}
                    onChange={(e) => setNewAppointment({ ...newAppointment, availability: e.target.value })}
                  >
                    <option value="Morning">Morning (8AM - 12PM)</option>
                    <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="Evening">Evening (5PM - 8PM)</option>
                    <option value="Weekends">Weekends</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>

                {formError && <p className="text-danger mt-2">{formError}</p>}
                {formSuccess && <p className="text-success mt-2">{formSuccess}</p>}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3 className="fw-bold mb-3">Scheduled Appointments</h3>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted mb-0">No appointments scheduled yet.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-3">
              {appointments.map((apt) => (
                <Col md={6} key={apt.id}>
                  <Card className="h-100 border-info">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="fw-bold mb-0">{apt.patientName}</h5>
                          <small className="text-muted">{apt.patientMRN}</small>
                        </div>
                        {getStatusBadge(apt.appointmentTime)}
                      </div>
                      <p className="text-muted mb-2">{apt.email}</p>
                      <p className="mb-2">
                        <strong>Department:</strong> {apt.department}
                      </p>
                      <p className="mb-2">
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                      <p className="text-muted small mb-0">
                        <i className="fas fa-clock me-1"></i>
                        {apt.appointmentTime}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Volunteers;
