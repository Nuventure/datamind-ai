import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard/ui/Dashboard";
import SummaryPage from "./pages/Dashboard/ui/SummaryPage";
import AnalysisDashboard from "./pages/Dashboard/ui/AnalysisDashboard";
import NotFound from "./pages/NotFound";

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
        path: "summary",
        element: <SummaryPage />,
      },
      {
        path: "analysis",
        element: <AnalysisDashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
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
