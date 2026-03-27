import { useSearchParams } from "react-router-dom";

const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      setSearchParams(params);
    });
  };
  const getParams = (key, defaultValue) => {
    return searchParams.get(key) ?? defaultValue;
  };

  return { getParams, setParams };
};

export default useQueryParams;
