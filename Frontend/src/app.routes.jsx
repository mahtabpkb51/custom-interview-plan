import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MyPlans from "./features/interview/pages/MyPlans";
import Practice from "./features/interview/pages/Practice";
import PracticeSession from "./features/interview/pages/PracticeSession";
import Progress from "./features/interview/pages/Progress";
import Profile from "./features/interview/pages/Profile";
import Settings from "./features/interview/pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/plans",
        element: <Protected><MyPlans /></Protected>
    },
    {
        path: "/practice",
        element: <Protected><Practice /></Protected>
    },
    {
        path: "/practice/:interviewId",
        element: <Protected><PracticeSession /></Protected>
    },
    {
        path: "/progress",
        element: <Protected><Progress /></Protected>
    },
    {
        path: "/profile",
        element: <Protected><Profile /></Protected>
    },
    {
        path: "/settings",
        element: <Protected><Settings /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])