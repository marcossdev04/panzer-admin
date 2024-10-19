import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { SquarePen } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Clients } from '@/types/Clients'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Loader } from './Loader'

interface Props {
  client: Clients | undefined
}

interface FormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function UpdatePasswordAdmin({ client }: Props) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    handleChangePassword(data)
  }

  const newPassword = watch('newPassword')

  async function handleChangePassword(data: FormData) {
    setLoading(true)
    await api.post('/api/change-password/', {
      user_email: client?.email,
      old_password: data.oldPassword,
      new_password: data.newPassword,
    })
    await queryClient.refetchQueries(['getClients'])
    toast.success('Senha alterada com sucesso!', {
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
          <div>Alterar senha</div>
          <div>
            <SquarePen size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl">
        <DialogTitle className="text-lime">Alterar senha</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-1.5">
            <Label className="text-lime" htmlFor="newPassword">
              Senha antiga
            </Label>
            <Input
              type="password"
              id="oldPassowrd"
              {...register('oldPassword', {
                required: 'A senha antiga é obrigatória',
              })}
              placeholder="Senha antiga"
              className="focus-visible:ring-lime"
            />
            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="mt-4 grid w-full items-center gap-1.5">
            <Label className="text-lime" htmlFor="newPassword">
              Nova senha
            </Label>
            <Input
              type="password"
              id="newPassword"
              {...register('newPassword', {
                required: 'Nova senha é obrigatória',
              })}
              placeholder="Nova senha"
              className="focus-visible:ring-lime"
            />
            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="mt-4 grid w-full items-center gap-1.5">
            <Label className="text-lime" htmlFor="confirmPassword">
              Confirmar senha
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: (value) =>
                  value === newPassword || 'As senhas não coincidem',
              })}
              placeholder="Confirmar senha"
              className="focus-visible:ring-lime"
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose>
              <Button
                className="flex items-center gap-1 rounded-xl px-3"
                variant={'ghost'}
                type="button"
              >
                <div>Cancelar</div>
              </Button>
            </DialogClose>
            {loading ? (
              <Button className=" flex items-center gap-1 rounded-xl bg-[#D2FF00] px-5  hover:bg-[#D2FF00] hover:bg-opacity-80">
                <div>
                  <Loader />
                </div>
              </Button>
            ) : (
              <Button
                className=" flex items-center gap-1 rounded-xl bg-[#D2FF00] px-3 hover:bg-[#D2FF00] hover:bg-opacity-80"
                type="submit"
              >
                <div>Editar</div>
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
