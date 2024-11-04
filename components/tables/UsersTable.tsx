import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import { AddStaff } from '../AddStaff'
import { Staff } from '@/types/Staff'
import { UpdateUser } from '../UpdateStaff'
import { DeleteStaff } from '../DeleteStaff'

interface Props {
  staffs: Staff[] | undefined
  isLoading: boolean
}
export function UsersTable({ staffs, isLoading }: Props) {
  const skeletonArray = Array.from({ length: 50 })
  const formatCPF = (cpf: string) => {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  return (
    <>
      <CardContent className="mt-5">
        <div>
          <div className="grid grid-cols-4 items-center rounded-t-xl bg-gradient-to-r from-[#D2FF00] to-[#58D764] px-10 py-2 font-medium text-zinc-900 mobile:px-1">
            <div className="col-span-1 mobile:col-span-1 mobile:text-xs">
              Nome
            </div>
            <div className="col-span-1 mobile:col-span-1 mobile:text-xs">
              CPF
            </div>
            <div className="col-span-1 flex  mobile:text-xs">Email</div>
            <div>
              <div className="flex justify-end">
                <AddStaff />
              </div>
            </div>
          </div>
          {!isLoading
            ? staffs?.map((staf, index) => {
                return (
                  <div
                    key={index}
                    className="mt-2 grid grid-cols-4 items-center bg-[#D9D9D9] bg-opacity-10 px-10 py-1 mobile:px-5 mobile:py-3"
                  >
                    <div className="col-span-1 flex text-sm mobile:col-span-4 mobile:text-lg">
                      {staf.first_name} {staf.last_name}
                    </div>
                    <div className="col-span-1 flex text-sm mobile:col-span-4 mobile:text-base">
                      {formatCPF(staf.cpf)}
                    </div>
                    <div className="col-span-1 flex text-sm mobile:col-span-3 mobile:text-base">
                      {staf.email}
                    </div>
                    <div className="flex mobile:hidden">
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
                          <UpdateUser staff={staf} />
                          <DeleteStaff staff={staf} />
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
