import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Skeleton } from '../../../ui/skeleton';

const ReviewLoadingTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Review</TableHead>
        <TableHead>Movie</TableHead>
        <TableHead>User</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ReviewLoadingTable;
