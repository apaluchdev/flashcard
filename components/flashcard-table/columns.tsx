"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { IFlashcard } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

export const columns: ColumnDef<ITopic>[] = [
  {
    accessorKey: "topicTitle",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className=""
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Topic Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return (
        <div className="text-center font-medium">
          <Link
            className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
            href={`/flashcard/${row.getValue("userId")}/${row.getValue(
              "topicTitle",
            )}`}
          >
            {row.getValue("topicTitle")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      // const amount = parseFloat(row.getValue("amount"));
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return (
        <div className="text-center font-medium">{row.getValue("userId")}</div>
      );
    },
  },
];
