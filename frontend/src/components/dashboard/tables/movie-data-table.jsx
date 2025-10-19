import * as React from "react"
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconMovie,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteMovie } from "@/hooks/useDeleteMovie"
import { useAuthContext } from "@/context/auth-provider"
import { toast } from "sonner"

// Create columns function that accepts handlers
const createColumns = (onEdit, onDelete, onView, currentUserId) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate" title={row.original.title}>
        {row.original.title}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {row.original.genres?.slice(0, 2).map((genre, index) => (
          <Badge key={index} variant="outline" className="text-xs px-1.5">
            {genre.name}
          </Badge>
        ))}
        {row.original.genres?.length > 2 && (
          <Badge variant="outline" className="text-xs px-1.5">
            +{row.original.genres.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.original.year}</div>
    ),
  },
  {
    accessorKey: "director",
    header: "Director",
    cell: ({ row }) => (
      <div className="text-sm max-w-[120px] truncate" title={row.original.director?.name}>
        {row.original.director?.name}
      </div>
    ),
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.averageRating ? `${row.original.averageRating.toFixed(1)}/5` : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "totalReviews",
    header: "Reviews",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.totalReviews || 0}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const isOwner = row.original.user?._id === currentUserId;
      
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original._id)}
              >
                Copy movie ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onView(row.original._id)}>
                <IconEye className="mr-2 h-4 w-4" />
                View movie
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(row.original._id)}>
                    <IconEdit className="mr-2 h-4 w-4" />
                    Edit movie
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(row.original._id, row.original.title)}
                  >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Delete movie
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]

export function MovieDataTable({ data, pagination, onPageChange, onSearchChange, onSortChange, onEditMovie }) {
  const { user } = useAuthContext();
  const { mutate: deleteMovie, isPending: isDeleting } = useDeleteMovie();
  
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const currentUserId = user?._id;

  // Action handlers
  const handleEdit = (movieId) => {
    onEditMovie(movieId);
  };

  const handleView = (movieId) => {
    // Open in new tab for viewing
    window.open(`/movies/${movieId}`, '_blank');
  };

  const handleDelete = (movieId, movieTitle) => {
    if (window.confirm(`Are you sure you want to delete "${movieTitle}"? This action cannot be undone.`)) {
      deleteMovie(movieId, {
        onSuccess: () => {
          toast.success("Movie deleted successfully!");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete movie");
        },
      });
    }
  };

  const columns = React.useMemo(
    () => createColumns(handleEdit, handleDelete, handleView, currentUserId),
    [currentUserId]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })


  // Handle sorting changes
  React.useEffect(() => {
    if (sorting.length > 0 && onSortChange) {
      const sort = sorting[0]
      onSortChange({
        sortBy: sort.id,
        sortOrder: sort.desc ? 'desc' : 'asc'
      })
    }
  }, [sorting, onSortChange])

  return (
    <div className="w-full space-y-4">
      {/* Selection Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-2 py-1">
            {table.getFilteredSelectedRowModel().rows.length} selected
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Use filters above to search and filter movies
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <IconMovie className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No movies found.</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or create a new movie.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            Showing {((pagination?.currentPage || 1) - 1) * (pagination?.limit || 10) + 1} to{" "}
            {Math.min((pagination?.currentPage || 1) * (pagination?.limit || 10), pagination?.totalItems || 0)} of{" "}
            {pagination?.totalItems || 0} movies
          </span>
          <span className="sm:hidden">
            {pagination?.totalItems || 0} movies total
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange((pagination?.currentPage || 1) - 1)}
            disabled={!pagination || pagination.currentPage <= 1}
            className="touch-manipulation"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">
              {pagination?.currentPage || 1} / {pagination?.totalPages || 1}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange((pagination?.currentPage || 1) + 1)}
            disabled={!pagination || pagination.currentPage >= pagination.totalPages}
            className="touch-manipulation"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
