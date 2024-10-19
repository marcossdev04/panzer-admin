import { Logs } from '@/types/logs'
import { CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { Check } from 'lucide-react'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface Props {
  logs: Logs[] | undefined
  isLoading: boolean
  onChangeFilter: (filter: {
    action: string
    description: string
    initialDate: string
    finalDate: string
  }) => void
}

export function LogsTable({ logs, isLoading, onChangeFilter }: Props) {
  const [action, setAction] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  const handleChangeAction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAction(event.target.value)
  }
  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value)
  }

  useEffect(() => {
    onChangeFilter({
      action: action || '',
      description: description || '',
      initialDate: String(date?.from) || '',
      finalDate: String(date?.to) || '',
    })
  }, [action, description, date, onChangeFilter])

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }
  const skeletonArray = Array.from({ length: 50 })
  return (
    <>
      <CardHeader>
        <CardTitle className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar por Ação</label>
            <Input
              onChange={handleChangeAction}
              className="w-full rounded-xl border-white"
              placeholder="Nome"
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar por Descrição</label>
            <Input
              onChange={handleChangeDescription}
              className="w-full rounded-xl border-white"
              placeholder=" Email"
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar por Data</label>
            <div className={cn('grid gap-2')}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start border-white text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'dd LLL , y')} -{' '}
                          {format(date.to, 'dd LLL , y')}
                        </>
                      ) : (
                        format(date.from, ' dd LLL , y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="grid grid-cols-12 items-center rounded-t-xl bg-gradient-to-r from-[#D2FF00] to-[#58D764] px-10 py-2 font-medium text-zinc-900 mobile:px-1">
            <div className="col-span-2 mobile:col-span-6 mobile:text-xs">
              Nome
            </div>
            <div className="col-span-2 mobile:col-span-4 mobile:text-xs">
              Email
            </div>
            <div className=" col-span-3 flex mobile:hidden mobile:text-xs">
              <div className="w-1/2">Início</div>
              <div className="w-1/2">Ação</div>
            </div>
            <div className="col-span-4 mobile:hidden mobile:text-xs">
              Descrição
            </div>
            <div className="col-span-1 flex justify-center mobile:text-xs">
              Ativo
            </div>
          </div>
          {!isLoading
            ? logs?.map((log, index) => {
                return (
                  <div
                    key={index}
                    className="mt-2 grid grid-cols-12 items-center bg-[#D9D9D9] bg-opacity-10 px-10 py-1 mobile:px-1"
                  >
                    <div className="col-span-2 text-sm mobile:col-span-6 mobile:text-xs">
                      {log.user.name}
                    </div>
                    <div className="col-span-2 text-sm mobile:col-span-4 mobile:text-xs">
                      {log.user.email}
                    </div>
                    <div className="col-span-3 flex text-sm mobile:hidden mobile:text-xs">
                      <div className="w-1/2 mobile:text-xs">
                        {formatDate(log.created_at)}
                      </div>
                      <div className="w-1/2 mobile:text-xs">{log.action}</div>
                    </div>
                    <div className="overflow-wrap-anywhere col-span-4 break-words text-sm mobile:hidden">
                      {log.description}
                    </div>
                    <div className="col-span-1 flex justify-center text-sm mobile:text-xs">
                      <Badge className=" h-6 rounded-full bg-[#58D764] px-1">
                        {log.active === true ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <Check size={16} className="text-white" />
                        )}
                      </Badge>
                    </div>
                  </div>
                )
              })
            : skeletonArray.map((_, index) => (
                <div
                  key={index}
                  className="mt-2 grid grid-cols-12 items-center gap-2 bg-[#D9D9D9] bg-opacity-10 px-10 py-2 mobile:px-1"
                >
                  <Skeleton className="col-span-2 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-2 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-3 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-4 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-1 h-[28px] rounded-xl" />
                </div>
              ))}
        </div>
      </CardContent>
    </>
  )
}
