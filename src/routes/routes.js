import Animal from "../pages/Animal";
import Search from "../pages/Search";

const routes = [
  { path: '/animal', element: <Animal />, name: 'Animal' },
  { path: '/', element: <Search />, name: 'Search' }
];

export default routes;
