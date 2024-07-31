import { useRouter, useSearchParams } from "next/navigation";

export const useURLState = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setURLState = (searchParamUpdate: Map<string, string>) => {
    const newParams = new URLSearchParams(searchParams);

    searchParamUpdate.forEach((value, key) => {
      newParams.set(key, value);
    });

    router.push("?" + newParams.toString());
  };

  return setURLState;
};
