import React, { useState, useEffect } from "react";
import { Form, Button, ProgressBar, Table, Alert } from "react-bootstrap";
import { formResponses } from "../api/formResponses";

function DynamicForm() {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (formType) {
      const response = formResponses[formType];
      setFormFields(response.fields);
      setFormData({});
      setErrors({});
      setProgress(0);
    }
  }, [formType]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateField(name, value);
    updateProgress();
  };

  const validateField = (name, value) => {
    const field = formFields.find((f) => f.name === name);
    let error = "";

    if (
      field.required &&
      (typeof value === "string" ? !value.trim() : !value)
    ) {
      error = `${field.label} is required.`;
    } else if (field.type === "number" && isNaN(value)) {
      error = `${field.label} must be a number.`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const updateProgress = () => {
    const filledFields = formFields.filter((f) => formData[f.name]);
    setProgress((filledFields.length / formFields.length) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    formFields.forEach((field) => {
      const value = formData[field.name] || "";
      validateField(field.name, value);

      if (!value && field.required) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...submittedData];
      updatedData[editIndex] = formData;
      setSubmittedData(updatedData);
      setAlertMessage("Changes saved successfully.");
    } else {
      setSubmittedData([...submittedData, formData]);
      setAlertMessage("Form submitted successfully.");
    }

    setShowAlert(true);
    setEditIndex(null);
    resetForm();
  };

  const resetForm = () => {
    setFormType("");
    setFormFields([]);
    setFormData({});
    setErrors({});
    setProgress(0);
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setEditIndex(index);
    setFormType(
      Object.keys(formResponses).find((key) =>
        formResponses[key].fields.every(
          (f, i) => f.name === Object.keys(submittedData[index])[i]
        )
      )
    );
    setAlertMessage("");
    setShowAlert(false);
  };

  const handleDelete = (index) => {
    setSubmittedData(submittedData.filter((_, i) => i !== index));
    setAlertMessage("Entry deleted successfully.");
    setShowAlert(true);
  };

  return (
    <div>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Form.Group controlId="formType">
        <Form.Label>Select Form Type</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => setFormType(e.target.value)}
          value={formType || ""}
        >
          <option value="">Select</option>
          {Object.keys(formResponses).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {formFields.length > 0 && (
        <Form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <Form.Group key={field.name} controlId={field.name}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === "dropdown" ? (
                <Form.Control
                  as="select"
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  isInvalid={!!errors[field.name]}
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              ) : field.type === "radio" ? (
                field.options.map((option) => (
                  <Form.Check
                    key={option}
                    type="radio"
                    label={option}
                    name={field.name}
                    value={option}
                    checked={formData[field.name] === option}
                    onChange={handleInputChange}
                    isInvalid={!!errors[field.name]}
                  />
                ))
              ) : field.type === "file" ? (
                <>
                  <Form.Control
                    type="file"
                    name={field.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors[field.name]}
                  />
                  {formData[field.name] && formData[field.name].name && (
                    <div className="mt-2">
                      <strong>Selected file: </strong>{" "}
                      {formData[field.name].name}
                    </div>
                  )}
                </>
              ) : (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  isInvalid={!!errors[field.name]}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <ProgressBar
            now={progress}
            label={`${Math.round(progress)}%`}
            className="my-3"
          />
          <Button type="submit">
            {editIndex !== null ? "Update" : "Submit"}
          </Button>
        </Form>
      )}

      {submittedData.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>
                    {/* Handle file value display */}
                    {value instanceof File ? value.name : value}
                  </td>
                ))}
                <td>
                  <Button variant="warning" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default DynamicForm;
