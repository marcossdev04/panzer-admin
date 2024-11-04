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
import { useState } from 'react'
import { Plan } from '@/types/Plans'
import { PlanTable } from '@/components/tables/PlanTable'

export default function Plans() {
  const [page, setPage] = useState(1)

  async function fetchPlans() {
    const response = await api.get(`/api/backoffice/plans/`)
    return response.data
  }
  const { data, isLoading } = useQuery<Plan[]>(['getPlans'], fetchPlans)

  function handlePreviewsPage() {
    page > 1 ? setPage(page - 1) : setPage(page)
  }
  return (
    <>
      <PlanTable plans={data} isLoading={isLoading} />
      {data?.length !== undefined ? (
        data.length < 20 ? (
          ''
        ) : (
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
        )
      ) : (
        ''
      )}
    </>
  )
}
