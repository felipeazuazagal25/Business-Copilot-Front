import axios from "axios";

export const fetchProducts = async () => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + "/products/all",
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "aa",
      },
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

export const fetchProductsById = async (product_id) => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + "/products/all",
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "aa",
      },
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

  return result.filter((item) => item.product_id === product_id)[0];
};

//to be done
export const fetchProductVariantsById = async (product_id) => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + `/products/variants/${product_id}`,
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "aa",
      },
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

export const fetchProductPricesById = async (product_id) => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + `/products/prices/${product_id}`,
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "aa",
      },
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

export const removeProducts = async (productsID) => {
  const val = await axios.post(
    process.env.REACT_APP_END_POINT + "/products/delete",
    { product_id: productsID }
  );
  console.log(val);

  return val;
};
