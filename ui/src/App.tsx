import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard/ui/Dashboard";
import AnalysisDashboard from "./pages/Dashboard/ui/AnalysisDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "analysis",
        element: <AnalysisDashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
