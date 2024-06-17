import { React, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { FiSettings } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { links } from "../data/dummy";
import isotipo from "../data/Isotipo.png";
import { useStateContext } from "../contexts/ContextProvider";

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const activeLink =
    "flex mr-8 items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white font-bold text-md m-2 bg-main-color-bg transition-all duration-250 ease-in-out";
  const normalLink =
    "flex mr-3 items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 transition-all duration-250 ease-in-out";

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 1024) {
      setActiveMenu(false);
    }
  };

  const keyDownHandler = (event) => {
    if (
      (event.ctrlKey && event.key === "k") ||
      (event.keyCode === 75 && event.metaKey)
    ) {
      setActiveMenu(!activeMenu);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  });

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center transition-all duration-1000 ease-in-out">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-Center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img className="w-8 h-8" src={isotipo} /> <span>Co-Business</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prevActiveMenu) => !prevActiveMenu)
                }
                className="text-xl text-black rounded-full p-3 hover:bg-light-gray mt-4 block"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 m-3 mt-4 uppercase">
                  {item.spaTitle}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitilize">{link.spaName}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
