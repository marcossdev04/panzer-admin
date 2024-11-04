import { BadgePlus, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { useState } from 'react'
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
  password: z
    .string()
    .min(6, { message: 'A senha precisa ter no mínimo 6 caracteres!' }),
})

export function AddStaff() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedData = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      is_staff: true,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
    }
    try {
      setLoading(true)
      await api.post('/api/backoffice/staffs/', formattedData)
      await queryClient.refetchQueries(['getStaffs'])
      setOpen(false)
      toast.success('Usuário adicionado com sucesso', {
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
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="flex justify-end">
        <BadgePlus size={35} />
      </DialogTrigger>
      <DialogContent className="max-w-[800px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle>Novo Funcionário</DialogTitle>
        <DialogDescription>Adicionar Novo Suporte</DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <div className="relative">
                    <Input
                      className="pr-10 placeholder:text-zinc-600"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-zinc-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
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
                  Confirmar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
