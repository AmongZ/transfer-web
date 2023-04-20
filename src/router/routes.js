import update from '../views/update';
import index from '../views/index.vue';

export default [
    {
        path: "/",
        name: "index",
        component: index,
    },
    {
        path: "/update",
        name: "update",
        component: update,
    }
]