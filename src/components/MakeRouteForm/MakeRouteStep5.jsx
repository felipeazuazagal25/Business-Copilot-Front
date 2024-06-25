import React, { useState, useEffect } from "react";
import {
  fetchOrders,
  removeOrders,
  getGroupedOrders,
} from "../../utils/fetchOrders";
import { getDuplicates, areThereNotFoundProducts } from "../../utils/utils";
import CustomDatePicker from "../CustomDatePicker";
import { ThreeDot } from "react-loading-indicators";
import DataTable from "../DataTable";

import { IoMdRefresh } from "react-icons/io";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const MakeRouteStep5 = ({ routeDay }) => {
  const driversTemplate = [
    { driver: "Victor", city: "LA FLORIDA" },
    { driver: "Victor", city: "LA PINTANA" },
    { driver: "Victor", city: "PUENTE ALTO" },
    { driver: "Victor", city: "SAN BERNARDO" },
    { driver: "Junior", city: "LA REINA" },
    { driver: "Junior", city: "LAS CONDES" },
    { driver: "Junior", city: "PROVIDENCIA" },
    { driver: "Junior", city: "SANTIAGO CENTRO" },
    { driver: "Junior", city: "VITACURA" },
    { driver: "Junior", city: "LO BARNECHEA" },
    { driver: "Luis", city: "CERRO NAVIA" },
    { driver: "Luis", city: "CONCHALI" },
    { driver: "Luis", city: "HUECHURABA" },
    { driver: "Luis", city: "INDEPENDENCIA" },
    { driver: "Luis", city: "QUILICURA" },
    { driver: "Luis", city: "RECOLETA" },
    { driver: "Luis", city: "RENCA" },
    { driver: "Rodrigo", city: "CERRILLOS" },
    { driver: "Rodrigo", city: "ESTACION CENTRAL" },
    { driver: "Rodrigo", city: "LO PRADO" },
    { driver: "Rodrigo", city: "MAIPU" },
    { driver: "Rodrigo", city: "PUDAHUEL" },
    { driver: "Rodrigo", city: "QUINTA NORMAL" },
    { driver: "Belen", city: "EL BOSQUE" },
    { driver: "Belen", city: "LA GRANJA" },
    { driver: "Belen", city: "PEDRO AGUIRRE CERDA" },
    { driver: "Belen", city: "SAN JOAQUIN" },
    { driver: "Belen", city: "SAN MIGUEL" },
    { driver: "Belen", city: "SAN RAMON" },
    { driver: "Jose", city: "LA CISTERNA" },
    { driver: "Jose", city: "LO ESPEJO" },
    { driver: "Carlos", city: "MACUL" },
    { driver: "Carlos", city: "ÑUÑOA" },
    { driver: "Carlos", city: "PEÑALOLEN" },
  ];
  const initialData = {
    groups: {
      "group-1": {
        id: "group-1",
        title: "Group 1",
        cards: [
          { id: "card-1", content: "Card 1", number: 10 },
          { id: "card-2", content: "Card 2", number: 20 },
          { id: "card-3", content: "Card 3", number: 30 },
        ],
      },
      "group-2": {
        id: "group-2",
        title: "Group 2",
        cards: [
          { id: "card-4", content: "Card 4", number: 40 },
          { id: "card-5", content: "Card 5", number: 50 },
        ],
      },
      "group-3": {
        id: "group-3",
        title: "Group 3",
        cards: [],
      },
      "group-4": {
        id: "group-4",
        title: "Group 4",
        cards: [],
      },
      "group-5": {
        id: "group-5",
        title: "Group 5",
        cards: [],
      },
    },
    groupOrder: ["group-1", "group-2", "group-3", "group-4", "group-5"],
  };
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);
  const [groupData, setGroupData] = useState(initialData);

  useEffect(async () => {
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(null, routeDay);
        setData(vals);
        const groupVals = getGroupedOrders(vals, driversTemplate);
        console.log(groupVals);
        setGroupData(groupVals);
        setIsDataLoading(false);
      } catch (error) {
        console.log(error);
        setData(null);
        setDataError(error);
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [routeDay, refreshPage]);

  const columns = [
    { header: "ID", accessorKey: "daily_id", footer: "ID" },
    { header: "Nombre", accessorKey: "name", footer: "Name" },
    { header: "Dirección", accessorKey: "address", footer: "Adress" },
    { header: "Comuna", accessorKey: "city", footer: "City" },
    {
      header: "Productos",
      accessorKey: "products",
      footer: "Products",
      cell: ({ row }) =>
        row.original.products !== undefined &&
        row.original.products
          .filter((item) => item.product_name !== "NotFound")
          .map((item) => (
            <>
              {item.product_name} <br />
            </>
          )),
    },
  ];

  const handleRemoveOrders = async (orders) => {
    const removeOrdersID = orders.map((item) => item.order_id);
    try {
      removeOrders(removeOrdersID).then((value) => {
        setRefreshPage(!refreshPage);
      });
    } catch (error) {
      throw Error(error.message);
    }
  };

  // Drag and drop lists

  const calculateGroupSum = (group) => {
    return group.cards.reduce((total, card) => total + card.number, 0);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = groupData.groups[source.droppableId];
    const finish = groupData.groups[destination.droppableId];

    const draggedCard = start.cards.find((card) => card.id === draggableId);
    console.log("draggedCard ", draggedCard); // City to move
    console.log("finsish", finish); // Driver to move the city to

    if (start === finish) {
      const newCardIds = Array.from(start.cards);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggedCard);

      const newGroup = {
        ...start,
        cards: newCardIds,
      };

      const newState = {
        ...groupData,
        groups: {
          ...groupData.groups,
          [newGroup.id]: newGroup,
        },
      };

      setGroupData(newState);
      return;
    }

    // Moving from one list to another
    const startCardIds = Array.from(start.cards);
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cards: startCardIds,
    };

    const finishCardIds = Array.from(finish.cards);
    finishCardIds.splice(destination.index, 0, draggedCard);
    const newFinish = {
      ...finish,
      cards: finishCardIds,
    };

    const newState = {
      ...groupData,
      groups: {
        ...groupData.groups,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setGroupData(newState);
  };

  return (
    <div className="flex-column justify-center p-3">
      <div className="flex w-full">
        <div className="w-full text-xl font-bold text-gray-600">
          Asignar Choferes
        </div>
        <div>
          <button
            className="p-2 h-10 w-10 rounded-full custom-hover-border active:bg-black"
            onClick={() => {
              setRefreshPage(!refreshPage);
            }}
          >
            <IoMdRefresh className="h-full w-full text-[#4048F1]" />
          </button>
        </div>
      </div>
      <div>
        {isDataLoading ? (
          <div className="w-full text-center min-h-72 flex items-center justify-center">
            <ThreeDot
              variant="brick-stack"
              color="#4048F1"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : dataError ? (
          <div>No hay pedidos agendados en esta fecha.</div>
        ) : data.length === 0 ? (
          <div>Todos los pedidos tienen productos en la base de datos</div>
        ) : (
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-wrap p-4">
                {groupData.groupOrder.map((groupId) => {
                  const group = groupData.groups[groupId];
                  return (
                    <Droppable droppableId={group.id} key={group.id}>
                      {(provided) => (
                        <div
                          className="bg-gray-100 rounded-lg p-4 w-60 m-3"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold ">
                              {group.title}
                            </h2>
                            <div>
                              Total:{" "}
                              <span className="font-bold">
                                {calculateGroupSum(group)}
                              </span>
                            </div>
                          </div>

                          {group.cards.length > 0 ? (
                            group.cards.map((card, index) => (
                              <Draggable
                                draggableId={card.id}
                                index={index}
                                key={card.id}
                              >
                                {(provided) => (
                                  <div
                                    className="bg-white p-4 rounded-lg shadow-md mb-2"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="w-full flex justify-between">
                                      <div>{card.content}</div>{" "}
                                      <div className="font-bold">
                                        {card.number}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="text-gray-500 italic text-sm w-full text-center">
                              Sin pedidos asignados
                            </div>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </DragDropContext>
            {/* <div className="">
              <DataTable
                addButton={false}
                columns={columns}
                data={data}
                columnRowClick={"order_id"}
                callbackRefresh={() => {
                  setRefreshPage(!refreshPage);
                }}
                callbackRemove={(removeElements) =>
                  handleRemoveOrders(removeElements)
                }
              />
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default MakeRouteStep5;
