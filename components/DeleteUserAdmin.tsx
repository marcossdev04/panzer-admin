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
import { Clients } from '@/types/Clients'
import { useState } from 'react'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Loader } from './Loader'

interface Props {
  client: Clients | undefined
}
export function DeleteUserAdmin({ client }: Props) {
  const [loading, setLoading] = useState(false)
  async function handleDeleteClient() {
    setLoading(true)
    await api.delete(`/api/users/${client?.id}`)
    await queryClient.refetchQueries(['getClients'])
    toast.success('Cliente deletado com sucesso!', {
      position: 'bottom-right',
      closeOnClick: true,
      theme: 'dark',
    })
    setLoading(false)
  }
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button
          className="flex w-full items-center justify-between px-2"
          variant="ghost"
        >
          <div>Deletar</div>
          <div>
            <Trash2 size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle className="text-lime">Deletar Usuário</DialogTitle>
        <DialogDescription>
          Você realmente deseja deletar este usuário?
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
