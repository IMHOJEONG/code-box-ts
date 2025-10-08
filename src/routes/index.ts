import { createBrowserRouter } from "react-router";
import { VariablePage } from "@/routes/variable-page/variable";
import App from "../App";
export const router = createBrowserRouter([
      {
            path: "/",
            Component: App,
            children: [
                  { index: true, Component: App },
                  { path: "variable", Component: VariablePage },
                  //   {
                  //         path: "auth",
                  //         Component: AuthLayout,
                  //         children: [
                  //               { path: "login", Component: Login },
                  //               { path: "register", Component: Register },
                  //         ],
                  //   },
                  //   {
                  //         path: "concerts",
                  //         children: [
                  //               { index: true, Component: ConcertsHome },
                  //               { path: ":city", Component: ConcertsCity },
                  //               { path: "trending", Component: ConcertsTrending },
                  //         ],
                  //   },
            ],
      },
]);
