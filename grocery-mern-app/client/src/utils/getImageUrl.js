const DEFAULT_BACKEND_URL = "https://grocery-backend.onrender.com";

const stripTrailingSlash = (value) => {
  if (!value) return "";
  return value.replace(/[\/\"\'\s]+$/, "").replace(/^[\"\'\s]+/, "");
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";

  const pathStr = String(imagePath);

  if (/^https?:\/\//i.test(pathStr)) {
    return pathStr;
  }

  const backendUrl = stripTrailingSlash(
    import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL
  );

  const normalizedPath = pathStr
    .replace(/^\/*(uploads|images)\//, "")
    .replace(/^\/+/, "");

  const finalUrl = `${backendUrl}/images/${normalizedPath}`;
  return finalUrl;
};
