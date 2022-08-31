// export interface Todo {
//   id: number;
//   content: string;
// }
//
// export interface Meta {
//   totalCount: number;
// }

import {ref} from "vue";

export interface blogIndexImpl {
  title: string;
  children: blogIndexImpl;
}

export let blogIndexDefault = ref([
  {
    title: 'docker基础', children: [
      {
        title: 'h2', children: [
          {title: 'h3', children: null},
          {title: 'h31', children: null}
        ]
      },
      {
        title: 'h21', children: null
      }
    ]
  },
  {title: "h11", children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null},
  {title: 'h11', children: null}
]);
