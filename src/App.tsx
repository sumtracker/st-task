import "./App.css";
import { RouterProvider, useLocation , useNavigate} from "react-router-dom";
import router from "./config/routes";
import { ConfigProvider } from "antd";
import { useEffect } from "react";

const App = () => {
 

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7d7ab9",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
