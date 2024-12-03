export const formResponses = {
  "User Information": {
    fields: [
      { name: "Name", type: "text", label: "Name", required: true },
      { name: "age", type: "number", label: "Age", required: true },
      {
        name: "Gender",
        type: "radio",
        label: "gender",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      { name: "Photo", type: "file", label: "photo", required: false },
    ],
  },
  "Address Information": {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  "Payment Information": {
    fields: [
      {
        name: "cardNumber",
        type: "text",
        label: "Card Number",
        required: true,
      },
      {
        name: "expiryDate",
        type: "date",
        label: "Expiry Date",
        required: true,
      },
      { name: "cvv", type: "password", label: "CVV", required: true },
      {
        name: "cardholderName",
        type: "text",
        label: "Cardholder Name",
        required: true,
      },
    ],
  },
};
