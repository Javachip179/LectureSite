import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';

import SignUp from "./pages/auth/signUp/SignUp"
import SignIn from "./pages/auth/signIn/SignIn"
import Write from "./pages/dodo/Write"
import Home from "./pages/home/Home"
import Single from "./pages/dodo/Single"
import Search from "./pages/search/Search"
import Courses from "./pages/dodo/Courses"
import OnlineStudy from "./pages/dodo/OnlineStudy"
import Profile from './pages/mypage/profile/profile';
import MyOnline from './pages/dodo/MyOnline';
import Cart from './pages/cart/Cart';
import Payment from './pages/mypage/payment/Payment';
import Mypage from './pages/mypage/Mypage';
import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/post/:id',
        element: <Single />,
      },
      {
        path: '/write',
        element: <Write />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/courses',
        element: <Courses />,
      },
      {
        path: '/mypage',
        element: <Mypage />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
      {
        path: '/myonline',
        element: <MyOnline />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
    ],
  },
  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/signIn',
    element: <SignIn />,
  },
  {
    path: '/onlinestudy',
    element: <OnlineStudy />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
