import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { useState } from 'react'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Loader } from './Loader'
import { Staff } from '@/types/Staff'

interface Props {
  staff: Staff | undefined
}
export function DeleteStaff({ staff }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  async function handleDeleteClient() {
    try {
      setLoading(true)
      await api.delete(`/api/users/${staff?.id}`)
      await queryClient.refetchQueries(['getStaffs'])
      toast.success('Funcionário deletado com sucesso!', {
        position: 'bottom-right',
        closeOnClick: true,
        theme: 'dark',
      })
      setOpen(false)
      setLoading(false)
    } catch {
      setLoading(false)
      setOpen(false)
      toast.error('Erro ao deletar o funcionário!', {
        position: 'bottom-right',
        closeOnClick: true,
        theme: 'dark',
      })
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogTrigger className="w-full">
        <Button
          className="flex w-80 items-center justify-between px-2"
          variant="ghost"
        >
          <div>Alterar usuário</div>
          <div>
            <Trash2 size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle className="text-lime">Deletar Fucionário</DialogTitle>
        <DialogDescription>
          Você realmente deseja deletar este funcionário?
        </DialogDescription>
        <div className="flex justify-end gap-2">
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
              onClick={handleDeleteClient}
            >
              <div>Deletar</div>
              <Trash2 size={18} strokeWidth={2.5} />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
