import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClientDetails } from '../ClientDetails'
import { DeleteUserAdmin } from '../DeleteUserAdmin'
import { UpdatePasswordAdmin } from '../UpdatePasswordAdmin'
import { Clients } from '@/types/Clients'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { AddContract } from '../AddContract'

interface Props {
  clients: Clients[] | undefined
  isLoading: boolean
  onChangeFilter: (filter: { name: string; email: string; cpf: string }) => void
}
export function ClientTable({ clients, isLoading, onChangeFilter }: Props) {
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [cpf, setCpf] = useState<string>()

  const skeletonArray = Array.from({ length: 50 })
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }
  const formatCPF = (cpf: string) => {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handleChangeCpf = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(event.target.value)
  }

  useEffect(() => {
    onChangeFilter({
      name: name || '',
      email: email || '',
      cpf: cpf || '',
    })
  }, [cpf, email, name, onChangeFilter])

  return (
    <>
      <CardHeader>
        <CardTitle className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar Cliente</label>
            <Input
              className="w-full rounded-xl border-white"
              onChange={handleChangeName}
              placeholder="Nome"
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar por Email</label>
            <Input
              className="w-full rounded-xl border-white"
              onChange={handleChangeEmail}
              placeholder=" Email"
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="px-2 text-white">Pesquisar por CPF</label>
            <Input
              className="w-full rounded-xl border-white"
              onChange={handleChangeCpf}
              placeholder=" CPF"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="grid grid-cols-12 items-center rounded-t-xl bg-gradient-to-r from-[#D2FF00] to-[#58D764] px-10 py-2 font-medium text-zinc-900 mobile:px-1">
            <div className="col-span-3 mobile:col-span-6 mobile:text-xs">
              Nome
            </div>
            <div className="col-span-2 mobile:col-span-4 mobile:text-xs">
              CPF
            </div>
            <div className=" col-span-3 flex mobile:hidden mobile:text-xs">
              <div className="w-1/2">Início</div>
              <div className="w-1/2">Fim</div>
            </div>
            <div className="col-span-2 mobile:hidden mobile:text-xs">Email</div>
            <div className="col-span-1 flex justify-end mobile:text-xs">
              Status
            </div>
            <div>
              <span className="sr-only">Actions</span>
            </div>
          </div>
          {!isLoading
            ? clients?.map((client, index) => {
                return (
                  <div
                    key={index}
                    className="mt-2 grid grid-cols-12 items-center bg-[#D9D9D9] bg-opacity-10 px-10 py-1 mobile:px-1"
                  >
                    <div className="col-span-3 text-sm mobile:col-span-6 mobile:text-xs">
                      {client.name}
                    </div>
                    <div className="col-span-2 text-sm mobile:col-span-4 mobile:text-xs">
                      {formatCPF(client.cpf)}
                    </div>
                    <div className="col-span-3 flex text-sm mobile:hidden mobile:text-xs">
                      <div className="w-1/2 mobile:text-xs">
                        {client.products.length > 0 &&
                          formatDate(
                            client.products[0].contract_period_start_date,
                          )}
                      </div>
                      <div className="w-1/2 mobile:text-xs">
                        {client.products.length > 0 &&
                          formatDate(
                            client.products[0].contract_period_end_date,
                          )}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm mobile:hidden">
                      {client.email}
                    </div>
                    <div className="col-span-1 flex justify-end text-sm mobile:text-xs">
                      {client.products
                        .filter((filter, index) => {
                          return filter.active === true && index === 0
                        })
                        .map((prod, index) => {
                          const formattedStatus =
                            prod.status === 'active'
                              ? 'Ativo'
                              : prod.status === 'ended'
                                ? 'Finalizado'
                                : prod.status === 'inactive'
                                  ? 'Inativo'
                                  : 'Cancelado'
                          return <div key={index}>{formattedStatus}</div>
                        })}
                    </div>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className=" "
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <ClientDetails client={client} />
                          <AddContract client={client} />
                          <UpdatePasswordAdmin client={client} />
                          <DeleteUserAdmin client={client} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            : skeletonArray.map((_, index) => (
                <div
                  key={index}
                  className="mt-2 grid grid-cols-12 items-center gap-2 bg-[#D9D9D9] bg-opacity-10 px-10 py-2 mobile:px-1"
                >
                  <Skeleton className="col-span-3 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-2 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-3 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-2 h-[28px] rounded-xl" />
                  <Skeleton className="col-span-1 h-[28px] rounded-xl" />
                </div>
              ))}
        </div>
      </CardContent>
    </>
  )
}
