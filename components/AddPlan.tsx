'use client'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader } from './Loader'
import { useForm } from 'react-hook-form'
import { Switch } from './ui/switch'

const FormSchema = z.object({
  plan_name: z.string({
    required_error: 'O nome do plano é obrigatório',
  }),
  plan_code: z.string({
    required_error: 'O código do plano é obrigatório',
  }),
  product_name: z.string({
    required_error: 'O código do plano é obrigatório',
  }),
  resource: z.string().optional(),
  img_resource: z.string().optional(),
  days: z.coerce
    .number({ required_error: 'digite o período do plano' })
    .min(1, { message: 'A duração deve ser pelo menos 1 dia' }),
  hot: z.boolean().default(false),
})

export function AddPlan() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedData =
      data.resource && data.img_resource === ''
        ? {
            product: {
              product_name: data.product_name,
              product_hot: data.hot,
            },
            plan_name: data.plan_name,
            plan_code: data.plan_code,
            days: data.days,
          }
        : {
            product: {
              product_name: data.product_name,
              resource: data.resource,
              img_resource: data.img_resource,
              product_hot: data.hot,
            },
            plan_name: data.plan_name,
            plan_code: data.plan_code,
            days: data.days,
          }
    try {
      setLoading(true)
      await api.post('/api/backoffice/plans/', formattedData)
      await queryClient.refetchQueries(['getPlans'])
      setOpen(false)
      toast.success('Plano adicionado com sucesso', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false)
      toast.error(
        err.response.data.plan_code
          ? 'O código deste plano ja existe'
          : err.response.data.product.img_resource
            ? 'Image inválida'
            : err.response.data.product.resource
              ? 'Recurso inválido'
              : err.response.data.product.product_name
                ? 'Este produto ja existe'
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
      <DialogTrigger>
        <div className="flex h-[296px] items-center justify-center rounded-xl border border-dashed transition-colors duration-300 hover:bg-zinc-900 mobile:h-[288x]">
          <div className="flex transition-all duration-300 hover:scale-110">
            <Plus size={60} strokeWidth={1.25} className="text-lime " />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogTitle className="text-2xl">Adicionar Plano</DialogTitle>
        <DialogTitle className="mt-3 laptop:mt-1">
          Detalhes do plano
        </DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 laptop:space-y-3"
          >
            <FormField
              control={form.control}
              name="hot"
              render={({ field }) => (
                <FormItem className="mt-3 flex items-center gap-3 space-y-0">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="flex h-9 items-center text-xl">Plano hot</div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <Input
                    placeholder="Mensal"
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
              name="plan_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do Plano</FormLabel>
                  <Input
                    placeholder="Código perfectpay"
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
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="10"
                      className="pr-14 placeholder:text-zinc-600"
                      type="number"
                      {...field}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      dias
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogTitle className="pt-3 laptop:mt-1">
              Detalhes do produto
            </DialogTitle>
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <Input
                    placeholder="Panzer Pro Mensal"
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
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurso</FormLabel>
                  <Input
                    placeholder="PowerBi link"
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
              name="img_resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <Input
                    placeholder="Link da imagem"
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
