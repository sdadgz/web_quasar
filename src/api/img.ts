import {api} from "boot/axios";

// 获取banner
export const getBannerByUsername = (username) => api.get("/img/" + username + "/background")

// 获取图片分页
export const getImgByPage = (username, currentPage, pageSize) => api.get("/img/" + username + "/page", {
  params: {
    currentPage,
    pageSize
  }
})

// 根据id删图片
export const deleteImgById = (id) => api.delete("/img", {
  data: {
    "id": id
  }
});

// 更新图片
export const updateImgField = (idList, field) => api.put("/img/update", {
  idList,
  field
})
