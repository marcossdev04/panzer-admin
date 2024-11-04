'use client'
import { api } from '@/api/api'
import { LogsTable } from '@/components/tables/LogsTable'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { Logs as LogType } from '@/types/logs'
import { format, isValid } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

export default function Logs() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<{
    action: string
    description: string
    initialDate: string
    finalDate: string
  }>({
    action: '',
    description: '',
    initialDate: '',
    finalDate: '',
  })
  const handleNameChange = useCallback(
    (filter: {
      action: string
      description: string
      initialDate: string
      finalDate: string
    }) => {
      setFilter(filter)
    },
    [],
  )
  const formatDate = (date: Date | string | number): string | undefined => {
    try {
      const dateObject = date instanceof Date ? date : new Date(date)
      if (!isValid(dateObject)) {
        throw new Error('Invalid date')
      }
      return format(dateObject, 'yyyy-MM-dd')
    } catch (error) {
      return undefined
    }
  }
  const formattedDateInitial = formatDate(filter.initialDate)
  const formattedDateFinal = formatDate(filter.finalDate)

  const formattedUrl = useMemo(() => {
    const params = new URLSearchParams()

    if (filter.action) {
      params.append('action', filter.action)
    }
    if (filter.description) {
      params.append('description', filter.description)
    }
    if (formattedDateFinal && formattedDateInitial) {
      params.append('created_at_after', formattedDateInitial)
      params.append('created_at_before', formattedDateFinal)
    }
    params.append('page', String(page))

    return `?${params.toString()}`
  }, [filter, page, formattedDateFinal, formattedDateInitial])

  async function fetchLogs() {
    const response = await api.get(`/api/backoffice/users/logs/${formattedUrl}`)
    return response.data.results
  }
  const { data, isLoading } = useQuery<LogType[]>(
    ['getLogs', formattedUrl],
    fetchLogs,
  )

  function handlePreviewsPage() {
    page > 1 ? setPage(page - 1) : setPage(page)
  }
  return (
    <>
      <LogsTable
        onChangeFilter={handleNameChange}
        isLoading={isLoading}
        logs={data}
      />
      {data && data.length >= 50 ? (
        <Pagination className="pb-5">
          <PaginationContent>
            <PaginationItem onClick={handlePreviewsPage}>
              <PaginationPrevious />
            </PaginationItem>
            {page !== 1 ? (
              <PaginationItem onClick={handlePreviewsPage}>
                <PaginationLink href="#">{page - 1}</PaginationLink>
              </PaginationItem>
            ) : (
              ''
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem onClick={() => setPage(page + 1)}>
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
