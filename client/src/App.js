import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';

import SignUp from "./pages/auth/signUp/SignUp"
import SignIn from "./pages/auth/signIn/SignIn"
import Home from './pages/home/Home';
import Search from './pages/search/SearchPage';
import Profile from './pages/mypage/profile/profile';
import Cart from './pages/cart/Cart';
import Payment from './pages/mypage/payment/Payment';
import Mypage from './pages/mypage/Mypage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LectureList from './pages/category/LectureList';
import LecturesInfo from './pages/lecturesinfo/LectureInfo';
import WatchLecture from './pages/watchLecture/WatchLecture';

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
        path: '/search',
        element: <Search />,
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
        path: '/lectureList',
        element: <LectureList />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
      {
        path: '/lecturesInfo/:lectureID',
        element: <LecturesInfo />,
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
    path: '/watchLecture/:lectureID',
    element: <WatchLecture />,
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
