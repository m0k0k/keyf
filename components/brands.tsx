"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { getContextsByUserId } from "@/lib/db/queries";
import { useSession } from "@/lib/auth-client";
import { useMemo } from "react";

export const Brands = () => {
  const trpc = useTRPC();
  const { data: brands, isLoading } = useGetAllContexts();
  function useGetAllContexts(limit?: number) {
    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const trpc = useTRPC();
    // Memoize the tRPC query options to prevent recreation
    const getAllBrandsQueryOptions = useMemo(() => {
      const options = trpc.context.getAllBrands.queryOptions();
      return {
        ...options,
        select: limit ? (data: any[]) => data.slice(0, limit) : undefined,
      };
    }, [trpc.context.getAllBrands, isAuthenticated, limit]);

    // Combined query for both authenticated and anonymous chats
    return useQuery(getAllBrandsQueryOptions);
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="">Brand Name</th>
          <th className="">Brand ID</th>
          <th className="">Brand Instructions</th>
        </tr>
      </thead>
      <tbody>
        {brands?.map((brand: any) => (
          <tr key={brand.id} className="bg-accent m-2 rounded-lg shadow-md">
            <td className="border-b p-1.5 text-left">
              <a href={`/app/${brand.id}`}>{brand.name}</a>
            </td>

            <td className="border-b p-1.5 text-left">{brand.id}</td>
            <td className="border-b p-1.5 text-left">{brand.instructions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
