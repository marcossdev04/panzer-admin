'use client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { api } from '@/api/api'
import { useQuery } from 'react-query'
import { UsersTable } from '@/components/tables/UsersTable'
import { useState } from 'react'
import { Staff } from '@/types/Staff'

export default function Users() {
  const [page, setPage] = useState(1)

  async function fetchStaffs() {
    const response = await api.get(`/api/backoffice/staffs/`)
    return response.data
  }
  const { data, isLoading } = useQuery<Staff[]>(['getStaffs'], fetchStaffs)

  function handlePreviewsPage() {
    page > 1 ? setPage(page - 1) : setPage(page)
  }
  return (
    <>
      <UsersTable isLoading={isLoading} staffs={data} />
      {data && data.length >= 50 ? (
        <Pagination>
          <PaginationContent className="cursor-pointer">
            <PaginationItem onClick={handlePreviewsPage}>
              <PaginationPrevious />
            </PaginationItem>
            {page !== 1 ? (
              <PaginationItem
                className="cursor-pointer"
                onClick={handlePreviewsPage}
              >
                <PaginationLink href="#">{page - 1}</PaginationLink>
              </PaginationItem>
            ) : (
              ''
            )}
            <PaginationItem className="cursor-pointer">
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className="cursor-pointer"
              onClick={() => setPage(page + 1)}
            >
              <PaginationLink href="#">{page + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem onClick={() => setPage(page + 1)}>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </>
  )
}
