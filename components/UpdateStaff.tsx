import { SquarePen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { useEffect, useState } from 'react'
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader } from './Loader'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Staff } from '@/types/Staff'

interface Props {
  staff: Staff | undefined
}

const FormSchema = z.object({
  phone: z.string({
    required_error: 'Número de telefone obrigatório',
  }),
  email: z.string({
    required_error: 'O email é obrigatório',
  }),
  first_name: z.string({ required_error: 'O primeiro nome é obrigatório' }),
  last_name: z.string({ required_error: 'O ultimo nome é obrigatório!' }),
  cpf: z.string({ required_error: 'CPF é obrigatório' }),
})

export function UpdateUser({ staff }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedData = {
      phone: data.phone,
      is_staff: true,
      email: data.email,
      cpf: data.cpf,
      first_name: data.first_name,
      last_name: data.last_name,
    }
    try {
      setLoading(true)
      await api.put(`/api/backoffice/staffs/${staff?.id}/`, formattedData)
      await queryClient.refetchQueries(['getStaffs'])
      setOpen(false)
      toast.success('Usuário atualizado com sucesso', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false)
      toast.error(
        err.response.data.email
          ? 'Este email já existe'
          : err.response.data.non_field_errors
            ? 'Cpf inválido'
            : 'Erro desconhecido',
        {
          position: 'bottom-right',
          theme: 'dark',
          closeOnClick: true,
        },
      )
    }
  }

  useEffect(() => {
    if (staff && open) {
      form.setValue('first_name', staff.first_name || '')
      form.setValue('last_name', staff.last_name || '')
      form.setValue('phone', staff.phone || '')
      form.setValue('email', staff.email || '')
      form.setValue('cpf', staff.cpf || '')
    }
  }, [staff, open, form.setValue, form])

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="flex justify-end">
        <Button
          className="flex w-80 items-center justify-between px-2"
          variant="ghost"
        >
          <div>Alterar usuário</div>
          <div>
            <SquarePen size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle>Atualizar usuário</DialogTitle>
        <DialogDescription>Atualizar dados do Suporte</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex w-full gap-5">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Primeiro Nome</FormLabel>
                    <Input
                      placeholder="João"
                      className="placeholder:text-zinc-600"
                      type="text"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Último Nome</FormLabel>
                    <Input
                      placeholder="Silva"
                      className="placeholder:text-zinc-600"
                      type="text"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    placeholder="(98) 9 8920-2782"
                    className="placeholder:text-zinc-600"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="email@email.com"
                    className="placeholder:text-zinc-600"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <Input
                    placeholder="999.999.999-99"
                    className="placeholder:text-zinc-600"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              {loading ? (
                <Button
                  type="submit"
                  className="bg-lime px-[38px] hover:bg-lime hover:bg-opacity-80"
                >
                  <Loader />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-lime hover:bg-lime hover:bg-opacity-80"
                >
                  Atualizar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
