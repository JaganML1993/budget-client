import Dashboard from "views/Dashboard.js";
import Login from "views/auth/Login.js";
import HouseSavings from "views/house-savings/List.js";
import HouseSavingsCreate from "views/house-savings/Create.js";
import Expenses from "views/expenses/List.js";
import ExpensesCreate from "views/expenses/Create.js";
import ExpensesEdit from "views/expenses/Edit.js";
import ExpensesView from "views/expenses/View.js";
import ListUpdateBalance from "views/expenses/ListUpdateBalance.js";
import Commitments from "views/commitments/List.js";
import CommitmentsCreate from "views/commitments/Create.js";
import CommitmentsView from "views/commitments/View.js";
import CommitmentsEdit from "views/commitments/Edit.js";
import CommitmentsHistory from "views/history/List.js";
import CommitmentsHistoryCreate from "views/history/Create.js";
import Notes from "views/Notes.js";
import CommitmentsHistoryEdit from "views/history/Edit.js";
import Logout from "views/auth/Logout.js"; // Import Logout component
import ProtectedRoute from "../src/components/ProtectedRoute"; // Import ProtectedRoute

var routes = [
  {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36", // Dashboard pie chart icon
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/house-savings",
    name: "House Savings",
    icon: "tim-icons icon-bank", // Home icon for house savings
    component: (
      <ProtectedRoute>
        <HouseSavings />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },  {
    path: "/house-savings/create",
    component: (
      <ProtectedRoute>
        <HouseSavingsCreate />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: "tim-icons icon-bag-16", // Bag icon for expenses
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
    path: "/expenses/history-update-balance/:id",
    component: (
      <ProtectedRoute>
        <ListUpdateBalance />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments",
    name: "Commitments",
    icon: "tim-icons icon-coins",
    component: (
      <ProtectedRoute>
        <Commitments />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/create",
    component: (
      <ProtectedRoute>
        <CommitmentsCreate />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/view/:id",
    component: (
      <ProtectedRoute>
        <CommitmentsView />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/edit/:id",
    component: (
      <ProtectedRoute>
        <CommitmentsEdit />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/history/:commitmentId",
    component: (
      <ProtectedRoute>
        <CommitmentsHistory />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/history/create/:commitmentId",
    component: (
      <ProtectedRoute>
        <CommitmentsHistoryCreate />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/commitments/history/edit/:id",
    component: (
      <ProtectedRoute>
        <CommitmentsHistoryEdit />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/notes",
    name: "Notes",
    icon: "tim-icons icon-single-copy-04", // Document icon for notes
    component: (
      <ProtectedRoute>
        <Notes />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/logout", // Add logout route
    name: "Logout",
    icon: "tim-icons icon-simple-remove", // Remove icon for logout
    component: <Logout />,
    layout: "/admin",
  },
];

export default routes;
