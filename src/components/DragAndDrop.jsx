import { React, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";

const DropzoneContainer = styled("div")({
  border: "2px dashed #ccc",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
});

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "200px",
  margin: "10px 0",
});

const DragAndDrop = ({ placeholder, className }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        console.log(fileContent); // You can send this content to your server
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <DropzoneContainer {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelta para subir el archivo</p>
      ) : (
        <p>{placeholder}</p>
      )}
    </DropzoneContainer>
  );
};

export default DragAndDrop;
