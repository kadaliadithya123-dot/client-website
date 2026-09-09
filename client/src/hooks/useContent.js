import { useEffect, useState } from "react";
import api from "../services/api.js";

export const useContent = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/content")
      .then((res) => setContent(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
};
