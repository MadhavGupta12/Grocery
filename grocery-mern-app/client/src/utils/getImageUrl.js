const DEFAULT_BACKEND_URL = "https://grocery-backend-mz5b.onrender.com";

const stripTrailingSlash = (value) => {
  if (!value) return "";
  return value.replace(/[/"'\s]+$/, "").replace(/^["'\s]+/, "");
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";

  const pathStr = String(imagePath);

  // If it's already a full URL (http/https), return as-is
  if (/^https?:\/\//i.test(pathStr)) {
    return pathStr;
  }

  // Otherwise, build backend image URL
  const backendUrl = stripTrailingSlash(
    import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL
  );

  const normalizedPath = pathStr
    .replace(/^\/*(uploads|images)\//, "")
    .replace(/^\/+/, "");

  const finalUrl = `${backendUrl}/images/${normalizedPath}`;
  return finalUrl;
};
