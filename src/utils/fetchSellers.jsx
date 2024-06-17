export const fetchSellers = async () => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + "/personnel/all",
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Error al conectar con el servidor");
    return response;
  }
  const result = await response.json();
  console.log(result);
  if (result.status === "404") {
    throw new Error("Error al cargar los productos.");
  }

  return result;
};
