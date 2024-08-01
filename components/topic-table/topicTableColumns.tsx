"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { ITopic } from "@/models/Topic";
import Link from "next/link";

export const topicTableColumns: ColumnDef<ITopic>[] = [
  {
    accessorKey: "topicTitle",
    header: ({ column }) => {
      return <div className="flex justify-center">Topic</div>;
    },
    cell: ({ row }) => {
      const topic: ITopic = row.getValue("topicTitle");
      return (
        <div className="text-center font-medium">
          <Link
            className="text-blue-500 underline visited:text-purple-500 hover:text-blue-800"
            href={`/flashcard/${row.original._id}`}
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
      return (
        <div className="text-center font-medium">{row.getValue("userId")}</div>
      );
    },
  },
];
