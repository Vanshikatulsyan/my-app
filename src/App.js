import React from "react";
import DynamicForm from "./components/DynamicForm";
import { Container, Navbar, Footer, Row, Col } from "react-bootstrap";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Dynamic Form App</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container>
        <Row>
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <DynamicForm />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer mt-4">
        <Container>
          <Row>
            <Col className="text-center py-3">
              © {new Date().getFullYear()} Dynamic Form App | All Rights
              Reserved
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default App;
