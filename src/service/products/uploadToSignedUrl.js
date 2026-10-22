// products/uploadToSignedUrl.js
// axiosInstance use pannadha: adhu Authorization header + baseURL add pannum, signed URL fail aagum
import axios from "axios";

const uploadToSignedUrl = async (url, file) => {
  try {
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default uploadToSignedUrl;