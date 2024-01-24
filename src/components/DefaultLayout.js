import React, { useEffect, useState } from "react";
import "../resourses/layout.css";
import { useNavigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";

function DefaultLayout({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  var getUser = async () => {
    var userdetails = await Auth.currentUserInfo();
    setUser(userdetails.attributes);
  };
  const userMenu = [
    {
      name: "Home",
      icon: "ri-home-line",
      path: "/",
    },
    {
      name: "Bookings",
      icon: "ri-file-list-line",
      path: "/bookings",
    },
    {
      name: "Admin",
      icon: "ri-user-settings-line",
      externalLink: "https://main.d29k5uk0y81wjo.amplifyapp.com/",
    },
    {
      name: "Logout",
      icon: "ri-logout-box-line",
      path: "/logout",
    },
  ];

  const menuToBeRendered = userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/";
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">AWSome Airline</h2>
          <h1 className="role">
            {user?.name} <br />
            Name : {user?.given_name}
          </h1>
          <h1 className="role">
            {user?.name} <br />
            Email : {user?.email}
          </h1>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToBeRendered.map((item, index) => {
            return (
              <Authenticator>
                {({ signOut, user }) => (
                  <div
                    className={`${
                      activeRoute === item.path && "active-menu-item"
                    } menu-item`}
                  >
                    <i className={item.icon}></i>
                    <span
                      onClick={() => {
                        if (item.path === "/logout") {
                          localStorage.removeItem("token");
                          signOut();
                          navigate("/");
                        } else {
                          navigate(item.path);
                        }
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
              </Authenticator>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
