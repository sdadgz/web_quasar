import {api} from "boot/axios";

// 修改文件
export const updateFileById = (fileId, isDelete: boolean = false) => api.put("/file/update", {
  "id": fileId,
  "isDelete": isDelete
});

// 删除文件
export const deleteFileById = (fileId) => api.delete("/file", {
  params: {
    "id": fileId,
  }
});

// 获取文件列表
export const getFileByUsername = (username, currentPage, pageSize) => api.get("/file/" + username + "/page", {
  params: {
    currentPage,
    pageSize,
  }
});
