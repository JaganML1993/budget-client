import Dashboard from "views/Dashboard.js";
import Login from "views/auth/Login.js";
import Expenses from "views/expenses/List.js";
import ExpensesCreate from "views/expenses/Create.js";
import ExpensesEdit from "views/expenses/Edit.js";
import ExpensesView from "views/expenses/View.js";
import Logout from "views/auth/Logout.js"; // Import Logout component
import ProtectedRoute from "components/ProtectedRoute"; // Import ProtectedRoute
import Icons from "views/Icons.js";

var routes = [
  {
    path: "/login",
    name: "Login",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: "tim-icons icon-atom",
    component: (
      <ProtectedRoute>
        <Expenses />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/expenses/create",
    component: (
      <ProtectedRoute>
        <ExpensesCreate />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/expenses/edit/:id",
    component: (
      <ProtectedRoute>
        <ExpensesEdit />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/expenses/view/:id",
    component: (
      <ProtectedRoute>
        <ExpensesView />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/logout", // Add logout route
    name: "Logout",
    icon: "tim-icons icon-simple-remove",
    component: <Logout />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: <Icons />,
    layout: "/admin",
  },
];

export default routes;
