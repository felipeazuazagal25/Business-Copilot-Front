import React, { useState } from "react";
import { Header, Button } from "../components";

import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import Form from "react-bootstrap/Form";

import axios from "axios";

import { useStateContext } from "../contexts/ContextProvider";

const ThemedTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    // fontSize: "0.875rem", // Small text
    backgroundColor: "white",
  },
  "&.Mui-focused": {
    backgroundColor: "#ffffff", // Ensure background color is white when focused
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#b3b3b3", // Different border color
    },
    "&:hover fieldset": {
      borderColor: "#b3b3b3",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#b3b3b3",
    },
  },
  "& input": {
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px white inset",
      WebkitTextFillColor: "black",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 100px white inset",
      WebkitTextFillColor: "black",
    },
    "&:-webkit-autofill:hover": {
      WebkitBoxShadow: "0 0 0 100px white inset",
      WebkitTextFillColor: "black",
    },
  },
}));

const CreateProducts = () => {
  const { loadingMessage, setLoadingMessage } = useStateContext();

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const submitForm = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      if (validateForm()) {
        setLoadingMessage(true);
        const val = await axios
          .post(process.env.REACT_APP_END_POINT + "/products/create", formData)
          .then(() => {
            window.location.href = baseUrl + "/products";
          });
      } else {
        alert("Faltan campos obligatorios.");
        setIsSubmitting(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    variant: "",
    quantity: "",
    matching_string: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Handling errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.name) {
      valid = false;
      newErrors.name = "Este campo es obligatorio";
    }
    if (!formData.variant) {
      valid = false;
      newErrors.variant = "Este campo es obligatorio";
    }
    if (!formData.quantity) {
      valid = false;
      newErrors.quantity = "Este campo es obligatorio";
    }
    if (!formData.matching_string) {
      valid = false;
      newErrors.message = "Este campo es obligatorio";
    }
    setErrors(newErrors);
    console.log(newErrors);
    return valid;
  };

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Añadir Nuevo Producto" />
          <div className="flex justify-center items-center"></div>
        </div>
        <form onSubmit={submitForm}>
          <ThemedTextField
            label="Nombre del Producto"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth={true}
            style={{ marginBottom: "0.9rem" }}
            InputLabelProps={{
              style: {
                backgroundColor: "transparent",
                color: "#616161",
              },
            }}
          />
          <ThemedTextField
            className="mb-6"
            label="Variante (aroma, color, sabor, etc)"
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            fullWidth={true}
            style={{ marginBottom: "0.9rem" }}
            InputLabelProps={{
              style: {
                backgroundColor: "transparent",
                color: "#616161",
              },
            }}
          />
          <ThemedTextField
            className="mb-6"
            label="Cantidad"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth={true}
            style={{ marginBottom: "0.9rem" }}
            onKeyPress={handleKeyPress}
            InputLabelProps={{
              style: {
                backgroundColor: "transparent",
                color: "#616161",
              },
            }}
          />
          <ThemedTextField
            className="mb-6"
            label="Matching String"
            name="matching_string"
            value={formData.matching_string}
            onChange={handleChange}
            fullWidth={true}
            style={{ marginBottom: "0.9rem" }}
            InputLabelProps={{
              style: {
                backgroundColor: "transparent",
                color: "#616161",
              },
            }}
          />
          <Button
            className="mr-3"
            onClick={() => {
              window.location.href = baseUrl + "/products";
            }}
          >
            Cancelar
          </Button>{" "}
          <Button type="submit" onClick={() => setIsSubmitting(true)}>
            Añadir
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreateProducts;
