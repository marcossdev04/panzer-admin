'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { SquarePen } from 'lucide-react'
import { z } from 'zod'
import { api } from '@/api/api'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plan } from '@/types/Plans'
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Loader } from './Loader'
import { Switch } from './ui/switch'

interface Props {
  plan: Plan | undefined
}

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

export function UpdatePlan({ plan }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hot: plan?.product.product_hot || false,
    },
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
      await api.put(`/api/backoffice/plans/${plan?.id}/`, formattedData)
      await queryClient.refetchQueries(['getPlans'])
      setOpen(false)
      toast.success('Plano atualizado com sucesso', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error('Erro ao atualizar o plano', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
    }
  }
  useEffect(() => {
    if (plan && open) {
      form.setValue('days', plan.days || 0)
      form.setValue('plan_code', plan.plan_code || '')
      form.setValue('plan_name', plan.plan_name || '')
      form.setValue('resource', plan.product.resource || '')
      form.setValue('img_resource', plan.product.img_resource || '')
      form.setValue('hot', plan.product.product_hot || false)
      form.setValue('product_name', plan.product.product_name || '')
    }
  }, [plan, open, form.setValue, form])
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <Button
          size={'icon'}
          className="rounded-full bg-transparent p-6 text-lime transition-colors duration-300 hover:bg-lime hover:text-black"
        >
          <div>
            <SquarePen size={30} strokeWidth={2} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogTitle>Editar Plano</DialogTitle>
        <DialogTitle className="mt-3">Detalhes do plano</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
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
            <DialogTitle className="pt-3">Detalhes do produto</DialogTitle>
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
