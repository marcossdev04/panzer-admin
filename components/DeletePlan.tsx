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
import { Plan } from '@/types/Plans'

interface Props {
  plan: Plan | undefined
}
export function DeletePlan({ plan }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  async function handleDeletePlan() {
    try {
      setLoading(true)
      await api.delete(`/api/backoffice/plans/${plan?.id}/`)
      await queryClient.refetchQueries(['getPlans'])
      toast.success('Plano deletado com sucesso!', {
        position: 'bottom-right',
        closeOnClick: true,
        theme: 'dark',
      })
      setOpen(false)
      setLoading(false)
    } catch (err) {
      toast.error('Erro ao deletar o plano', {
        position: 'bottom-right',
        closeOnClick: true,
        theme: 'dark',
      })
      setOpen(false)
      setLoading(false)
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogTrigger className="">
        <Button
          size={'icon'}
          className="rounded-full bg-transparent p-6 text-[#d03131] transition-colors duration-300 hover:bg-[#a40c0c] hover:text-black"
        >
          <div>
            <Trash2 size={30} strokeWidth={2} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle className="text-lime">Deletar Plano</DialogTitle>
        <DialogDescription>
          Você realmente deseja deletar este plano?
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
              onClick={handleDeletePlan}
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
