import update from '../components/update';
import doorway from '../components/doorway';

export default [
  {
    path: "/",
    name: "index",
    component: doorway,
  },
  {
    path: "/update",
    name: "update",
    component: update,
  }
]