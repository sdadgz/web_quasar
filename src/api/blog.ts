import {api} from "boot/axios";

// 获取某人博客详情
export const getBlogDetail = (username, title) => api.get("/blog/" + username + "/blog/" + title);

// 获取博客列表
export const getBlogs = (username, currentPage, pageSize) => api.get("/blog/" + username + "/blogs", {
  params: {
    currentPage: currentPage,
    pageSize: pageSize
  }
});

// 获取博客分页
export const getBlogByPage = (username, currentPage, pageSize) => api.get("/blog/" + username + "/page", {
  params: {
    currentPage,
    pageSize,
  }
})

// 删除博客
export const deleteBlogByIdList = (idList) => api.delete("/blog", {
  data: {
    "idList": idList
  }
});

// 更新博客
export const updateBlog = (blogId, imgInfo, titleInfo, detailInfo) => api.post("/blog/update", {
  "id": blogId,
  "imgId": imgInfo,
  "title": titleInfo,
  "detail": detailInfo
})
