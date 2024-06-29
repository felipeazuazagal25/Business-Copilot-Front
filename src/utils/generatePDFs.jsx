import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const generateRoutePDF = (orders, driver, date) => {
  const pdf = new jsPDF({ orientation: "landscape" });

  pdf.setProperties({
    title: "Route Orders",
  });

  pdf.setFontSize(10);

  // Add driver name and date
  const companyName = "Mundo Tito";
  const reportTitle = "Ruta Diaria";

  // Summary Statistics
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  // Add company logo (if available) and name
  // pdf.addImage(companyLogo, 'PNG', 10, 10, 50, 20); // Assuming you have a logo image
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.text(companyName + " - " + reportTitle, 10, 20, {
    align: "left",
  });

  // Add driver information, route date, report generation date, and summary statistics
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  pdf.setTextColor(50);
  pdf.text(`Conductor: ${driver}`, 10, 30);
  pdf.text(`Día de Ruta: ${date}`, 10, 35);

  pdf.text(`Cantidad de Pedidos: ${totalOrders}`, 100, 30);
  pdf.text(`Monto Total: $${totalAmount.toFixed(0)}`, 100, 35);

  pdf.setLineWidth(0.1);
  pdf.setDrawColor(128);
  pdf.line(10, 40, pdf.internal.pageSize.getWidth() - 10, 40); // Gray line

  // Prepare the table columns
  const columns = [
    { title: "PAGO", dataKey: "payment_status" },
    { title: "N°", dataKey: "daily_id" },
    { title: "NOMBRE", dataKey: "name" },
    { title: "DIRECCIÓN", dataKey: "address" },
    { title: "BLOCK Y/O DEPTO", dataKey: "block_depto" },
    { title: "COMUNA", dataKey: "city" },
    { title: "FONO", dataKey: "phone_number" },
    { title: "PEDIDO", dataKey: "order_details" },
    { title: "A PAGAR", dataKey: "amount" },
    { title: "MEDIO DE PAGO", dataKey: "payment_method" },
    { title: "OBSERVACIONES", dataKey: "delivery_note" },
    { title: "VENDEDOR", dataKey: "seller_name" },
  ];

  // Prepare the table rows
  console.log("rows: ", orders);
  const rows = orders.map((order) => ({
    payment_status: "",
    daily_id: order.daily_id,
    name: order.name.toUpperCase(),
    address: order.address.split(",")[0].toUpperCase(),
    // block_depto: order.address.split(",")[0]?.toUpperCase(),
    city: order.city?.toUpperCase(),
    phone_number: order.phone_number,
    // order_details: "", // Set to empty string to avoid default rendering
    // products: order.products.map((p) => ({
    //   quantity: p.quantity,
    //   product_name: p.product_name.toUpperCase(),
    //   variation: p.variation.toUpperCase(),
    // })),
    order_details: order.products
      .map((p) =>
        p.not_found_name
          ? `${
              p.quantity
            } x ${p.not_found_name?.toUpperCase()} (${p.not_found_variant?.toUpperCase()})`
          : `${
              p.quantity
            } x ${p.product_name?.toUpperCase()} (${p.variant?.toUpperCase()})`
      )
      .join("\n"),
    amount: order.amount,
    payment_method: order.payment_info_array[0].payment_method?.toUpperCase(),
    delivery_note:
      order.delivery_info_array[
        order.delivery_info_array.length - 1
      ].delivery_note?.toUpperCase(),
    seller_name: order.seller_name?.toUpperCase(),
  }));

  // Add the table to the PDF
  pdf.autoTable({
    head: [columns.map((col) => col.title)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
    startY: 45,
    theme: "plain", // Ensure no default styling is applied
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255], // No background color
    },
    styles: {
      fontSize: 8,
      lineColor: [0, 0, 0], // Black lines for borders
      lineWidth: 0.1, // Border width
    },
    tableLineColor: [0, 0, 0], // Black table border
    tableLineWidth: 0.1, // Table border width
    didDrawCell: (data) => {
      const { doc, cell, row, column, table } = data;
      if (data.section === "head" && row.index === 0) {
        // Draw a thicker line below the header
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5); // Double the width of other borders
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
        // Reset to normal line width for other borders
        doc.setLineWidth(0.05);
      }

      // Nested table for products
      //   if (column.index === 7 && cell.section === "body") {
      //     // Render nested table for products
      //     const products = rows[row.index].products; // Get the products array
      //     console.log(products);
      //     if (products && products.length > 0) {
      //       const startX = cell.x + 2; // Adjust start position
      //       let startY = cell.y + 2;
      //       products.forEach((product) => {
      //         const text = `${product.quantity} x ${product.product_name} - ${product.variation}`;
      //         doc.text(text, startX, startY);
      //         startY += 4; // Adjust the line height
      //       });
      //     }
      //   }
    },
    columnStyles: {
      0: { cellWidth: 15 }, // Narrower N° column
      1: { cellWidth: 12 }, // Narrower N° column
      2: { cellWidth: 20 }, // Wider NOMBRE column
      3: { cellWidth: 25 }, // Wider DIRECCIÓN column
      4: { cellWidth: 15 }, // Wider BLOCK Y/O DEPTO column
      5: { cellWidth: 25 }, // Wider COMUNA column
      6: { cellWidth: 20 }, // Wider FONO column
      7: { cellWidth: 45 }, // Wider PEDIDO column
      8: { cellWidth: 15 }, // Wider A PAGAR column
      9: { cellWidth: 20 }, // Wider MEDIO DE PAGO column
      10: { cellWidth: 35 }, // Wider OBSERVACIONES column
    },
  });

  // Save the PDF
  pdf.save(`Route_Orders_${driver}_${date}.pdf`);
};

export const generateLoadDriverPDF = (orders, driver, date) => {
  const pdf = new jsPDF({ orientation: "portrait" });

  const borderX = 20;

  pdf.setProperties({
    title: "Loading List",
  });

  pdf.setProperties({
    title: "Route Orders",
  });

  pdf.setFontSize(10);

  // Add driver name and date
  const companyName = "Mundo Tito";
  const reportTitle = "Carga";

  // Add company logo (if available) and name
  // pdf.addImage(companyLogo, 'PNG', 10, 10, 50, 20); // Assuming you have a logo image
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.text(companyName + " - " + reportTitle, borderX, 20, {
    align: "left",
  });

  // Add driver information, route date, report generation date, and summary statistics
  // Add driver information, route date, report generation date, and summary statistics
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  pdf.setTextColor(50);
  pdf.text(`Conductor: ${driver}`, borderX, 30);
  pdf.text(`Día de Ruta: ${date}`, borderX, 35);

  pdf.setLineWidth(0.1);
  pdf.setDrawColor(128);
  pdf.line(borderX, 40, pdf.internal.pageSize.getWidth() - borderX, 40); // Gray line

  // Group products by name and variation
  const productGroups = orders.reduce((acc, order) => {
    order.products.forEach((product) => {
      const productKey = `${product.product_name}-${product.variation}`;
      if (!acc[productKey]) {
        acc[productKey] = {
          name: product.product_name.toUpperCase(),
          variation: product.variation.toUpperCase(),
          quantity: 0,
        };
      }
      acc[productKey].quantity += product.quantity;
    });
    return acc;
  }, {});

  // Prepare the table data
  const groupedProducts = Object.values(productGroups).reduce(
    (acc, product) => {
      const productName = product.name;
      if (!acc[productName]) {
        acc[productName] = [];
      }
      acc[productName].push(product);
      return acc;
    },
    {}
  );

  const tableData = [];
  Object.keys(groupedProducts).forEach((productName, index) => {
    tableData.push([
      {
        content: `${productName}`,
        colSpan: 3,
        styles: {
          halign: "left",
          fontStyle: "bold",
          fillColor: [255, 255, 255],
        },
      },
    ]);
    groupedProducts[productName].forEach((product) => {
      tableData.push([
        { content: "", styles: { fillColor: [255, 255, 255] } },
        {
          content: `${product.variation}`,
          styles: { fillColor: [255, 255, 255] },
        },
        {
          content: `${product.quantity}`,
          styles: { fillColor: [255, 255, 255], halign: "center" },
        },
      ]);
    });
  });

  console.log(tableData);

  const tableWidth = 90; // Adjust based on your column widths and content
  const pageWidth = pdf.internal.pageSize.getWidth();
  const startX = (pageWidth - tableWidth) / 2;

  // Add the table to the PDF

  const startY = 40;

  tableData.forEach((product, id) => {
    console.log("product ", product);
    const eachTable = [product];
    const firstCurrentY = id === 0 ? startY : pdf.previousAutoTable.finalY;
    const currentY = firstCurrentY + (product[0].colSpan === 3 ? 5 : 0);

    pdf.autoTable({
      startY: currentY,
      startX: 100,
      body: eachTable,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 1.5,
      },
      headStyles: {
        fillColor: [255, 255, 255], // No background color for header
        textColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      bodyStyles: {
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Adjust width of the first column
        1: { cellWidth: 70 }, // Adjust width of the second column
        2: { cellWidth: 10 }, // Adjust width of the third column
      },
      margin: startX, // Remove right and left margins
      // tableWidth: "wrap", // Ensure the table width wraps the content
      tableLineColor: [255, 255, 255],
      tableLineWidth: 0, // Table border width
    });
  });

  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Firma:", borderX, pageHeight - 15);
  pdf.line(
    40,
    pageHeight - 15,
    pdf.internal.pageSize.getWidth() - borderX,
    pageHeight - 15
  ); // Signature line

  // Save the PDF
  pdf.save(`Carga_${driver}_${date}.pdf`);
};
