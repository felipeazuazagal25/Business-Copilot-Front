import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoopingCart } from "react-icons/ai";
import { BsChatLeft } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import avatar from "../data/avatar.jpg";

import { Cart, Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const Navbar = ({ className }) => {
  const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={customFunc}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-ligth-gray"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        ></span>
        {icon}
      </button>
    </TooltipComponent>
  );

  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 1024) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className={`h-20 ${className}`}>
      <div
        style={{ zIndex: 4000 }}
        className={`flex fixed justify-between p-2 ${className} bg-indigo-50 top-0 pb-0${
          activeMenu ? "" : ""
        }`}
        fixed="top"
      >
        <NavButton
          title="Menu"
          customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
          color="blue"
          icon={<AiOutlineMenu />}
        />
        <div className="flex">
          <NavButton
            title="Notifications"
            dotColor="#03C9D7"
            customFunc={() => handleClick("notification")}
            color="blue"
            icon={<RiNotification3Line />}
          />
          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={() => handleClick("userProfile")}
            >
              <p className="leading-8">
                <span className="text-gray-400 text-14">Hola, </span>{" "}
                <span className="text-gray-400 font-bold ml-1 text-14">
                  Mundo Tito
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          </TooltipComponent>

          {isClicked.notification && <Notification />}
          {isClicked.userProfile && <UserProfile />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
