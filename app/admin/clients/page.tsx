'use client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { ClientTable } from '@/components/tables/ClientTable'
import { api } from '@/api/api'
import { useQuery } from 'react-query'
import { Clients } from '@/types/Clients'
import { useCallback, useMemo, useState } from 'react'

export default function ClientAdmin() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<{
    name: string
    email: string
    cpf: string
  }>({
    name: '',
    email: '',
    cpf: '',
  })

  const handleNameChange = useCallback(
    (filter: { name: string; email: string; cpf: string }) => {
      setFilter(filter)
    },
    [],
  )

  const formattedUrl = useMemo(() => {
    const params = new URLSearchParams()

    if (filter.name) {
      params.append('name', filter.name)
    }
    if (filter.email) {
      params.append('email', filter.email)
    }
    if (filter.cpf) {
      params.append('cpf', filter.cpf)
    }
    params.append('page', String(page))

    return `?${params.toString()}`
  }, [filter, page])

  async function fetchClients() {
    const response = await api.get(`/api/backoffice/users/${formattedUrl}`)
    return response.data.results
  }
  const { data, isLoading } = useQuery<Clients[]>(
    ['getClients', formattedUrl],
    fetchClients,
  )

  function handlePreviewsPage() {
    page > 1 ? setPage(page - 1) : setPage(page)
  }
  return (
    <>
      <ClientTable
        onChangeFilter={handleNameChange}
        isLoading={isLoading}
        clients={data}
      />
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
    </>
  )
}
