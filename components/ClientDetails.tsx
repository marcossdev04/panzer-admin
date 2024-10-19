'use client'
import { Button } from '@/components/ui/button'
import { Check, CircleUser, Eye, Trash2 } from 'lucide-react'
import wpp from '@/assets/whatsapp-svgrepo-com.svg'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Clients } from '@/types/Clients'
import { format } from 'date-fns'
import { useState } from 'react'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Loader } from './Loader'
interface Props {
  client: Clients | undefined
}
export function ClientDetails({ client }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const formatName = (fullName: string | undefined) => {
    const nameParts = fullName?.trim().split(' ')
    const firstName = nameParts !== undefined ? nameParts[0] : ''
    const lastName =
      nameParts !== undefined ? nameParts[nameParts.length - 1] : ''

    return `${firstName} ${lastName}`
  }
  const formatNumber = (number: string | undefined): string => {
    const cleaned = number?.replace(/\D/g, '')
    const truncated = cleaned?.slice(0, 9)
    const formatted = truncated?.replace(/(\d{5})(\d{4})/, '$1-$2')
    return formatted !== undefined ? formatted : ''
  }
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }
  async function handleDeleteContract(id: string) {
    try {
      setLoading(true)
      await api.delete(`/api/contracts/destroy/${id}`)
      await queryClient.refetchQueries(['getClients'])
      toast.success('Contrato deletado com sucesso!', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setLoading(false)
      setOpen(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
      toast.error('Não foi possivel deletar este contrato', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full">
        <Button
          className="flex w-full items-center justify-between px-2"
          variant="ghost"
        >
          <div>Inspecionar</div>
          <div>
            <Eye size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <div className="flex py-5 mobile:flex-col mobile:py-0">
          <div className="mx-5 w-1/3 mobile:mx-0 mobile:w-full">
            <div className="pb-3">
              <div className="flex max-w-lg flex-col gap-5 text-balance  leading-relaxed">
                <div className="flex justify-center">
                  <CircleUser className="text-lime" size={100} />
                </div>
                <div className="flex justify-center text-center text-3xl font-medium text-lime ">
                  {formatName(client?.name)}
                </div>
                <div className="flex justify-center text-sm font-medium text-white">
                  {client?.email}
                </div>
                <div className="mx-auto flex items-center ">
                  <div className="flex w-[50%] flex-col items-center justify-center border-r-2 pr-5">
                    <div className="text-sm text-white">Produtos</div>
                    <div className="text-xl font-medium text-lime ">
                      {client?.products.length}
                    </div>
                  </div>
                  <div className="flex w-[50%] flex-col items-center justify-center pl-5">
                    <div className="text-sm text-white">Plano</div>
                    <div className="text-xl font-medium text-lime ">Pro</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <Button className="flex justify-between gap-3 bg-lime  text-zinc-900 hover:bg-lime  hover:bg-opacity-80 ">
                <div className="font-semibold">
                  {formatNumber(client?.phone_number)}
                </div>
                <div>
                  <Image width={16} alt="wpp" src={wpp} />
                </div>
              </Button>
            </div>
          </div>
          <div className="mx-5 w-2/3 mobile:mx-0 mobile:w-full">
            <div className="flex flex-col">
              <div className="mb-3 flex justify-center text-2xl font-medium text-lime  mobile:mt-5">
                Histórico de transações
              </div>
              <Card className="flex h-[300px] flex-col overflow-auto  mobile:h-[200px]">
                {client?.products
                  .filter((filter) => {
                    return filter.active === true
                  })
                  .map((prod, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b px-3 py-2 font-medium"
                      >
                        <div className="text-xs">
                          {formatDate(prod.contract_period_start_date)} -{' '}
                          {formatDate(prod.contract_period_end_date)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <div className="text-xs">
                            {prod.resources.product_name}
                          </div>
                          <Badge className="ml-1 rounded-full bg-lime px-0 py-0 hover:bg-lime hover:bg-opacity-80">
                            <Check size={15} />
                          </Badge>
                          <Dialog>
                            <DialogTrigger>
                              <button className="flex items-center justify-center">
                                <Trash2
                                  className="transition-colors duration-300 hover:text-red-500"
                                  size={18}
                                />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="w-[500px] mobile:w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
                              <DialogTitle>Deletar contrato?</DialogTitle>
                              <DialogDescription>
                                Você realmente deseja deletar o contrato :{' '}
                                <span className="text-lime">
                                  {prod.resources.product_name}
                                </span>{' '}
                                <br /> do cliente:{' '}
                                <span className="text-lime">{client.name}</span>
                              </DialogDescription>
                              <div className="flex w-full justify-end">
                                <DialogClose>
                                  <Button
                                    className="flex items-center gap-1 rounded-xl px-3"
                                    variant={'ghost'}
                                  >
                                    <div>Cancelar</div>
                                  </Button>
                                </DialogClose>
                                {loading ? (
                                  <Button
                                    className="flex items-center gap-1 rounded-xl px-9"
                                    variant={'destructive'}
                                  >
                                    <div>
                                      <Loader />
                                    </div>
                                  </Button>
                                ) : (
                                  <Button
                                    className="flex items-center gap-1 rounded-xl px-3"
                                    variant={'destructive'}
                                    onClick={() =>
                                      handleDeleteContract(prod.id)
                                    }
                                  >
                                    <div>Deletar</div>
                                    <Trash2 size={18} strokeWidth={2.5} />
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )
                  })}
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
