import { BadgePlus, CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Clients } from '@/types/Clients'
import { api } from '@/api/api'
import { useQuery } from 'react-query'
import { Resources } from '@/types/Resources'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Input } from './ui/input'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { DateRange } from 'react-day-picker'
import { queryClient } from '@/api/QueryClient'
import { toast } from 'react-toastify'
import { Loader } from './Loader'

interface Props {
  client: Clients | undefined
}
const FormSchema = z.object({
  resource: z.string({
    required_error: 'Selecione um plano válido!',
  }),
  method_payment: z.string({
    required_error: 'Selecione um método de pagamento válido!',
  }),
  description: z.string({ required_error: 'Escreva uma observação!' }),
})

export function AddContract({ client }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const today = new Date()
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  )
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: nextMonth,
  })
  const [value, setValue] = useState<number>(0)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  async function fetchResources() {
    const response = await api.get('/api/contracts/resources-products/')
    return response.data.results
  }
  const { data: resources } = useQuery<Resources[]>(
    ['getResources'],
    fetchResources,
  )

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    })
      .format(value / 100)
      .trim()
  }
  function handleValueChange(
    setValue: React.Dispatch<React.SetStateAction<number>>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const rawValue = event.target.value.replace(/\D/g, '')
    const parsedValue = parseInt(rawValue || '0', 10)

    setValue(parsedValue)
  }

  const paymentOptions = [
    { value: 'credit_card', label: 'Cartão de crédito' },
    { value: 'debit_card', label: 'Cartão de débito' },
    { value: 'transfer', label: 'Transferência' },
    { value: 'billet', label: 'Boleto' },
    { value: 'pix', label: 'Pix' },
  ]
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedData = {
      resources: data.resource,
      user: client?.id,
      comment: data.description,
      contract_period_start_date:
        date?.from !== undefined
          ? format(date.from, 'yyyy-MM-dd HH:mm:ss.SSSxxx')
          : new Date(),
      contract_period_end_date:
        date?.to !== undefined
          ? format(date.to, 'yyyy-MM-dd HH:mm:ss.SSSxxx')
          : nextMonth,
      payment_method: data.method_payment,
      value: value / 100,
    }
    try {
      setLoading(true)
      await api.post('/api/contracts/create', formattedData)
      await queryClient.refetchQueries(['getClients'])
      setOpen(false)
      toast.success('Contrato adicionado com sucesso', {
        position: 'bottom-right',
        theme: 'dark',
        closeOnClick: true,
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full">
        <Button
          className="flex w-full items-center justify-between px-2"
          variant="ghost"
        >
          <div>Adicionar Contrato</div>
          <div>
            <BadgePlus size={18} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] mobile:max-w-[350px] mobile:rounded-xl tablet:rounded-2xl laptop:rounded-2xl desktop:rounded-2xl ">
        <DialogTitle>Adicionar contrato manualmente</DialogTitle>
        <DialogDescription>
          Adicionar contrato para {client?.name}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar Plano</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano existente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resources?.map((resource, index) => {
                        return (
                          <SelectItem key={index} value={resource.id}>
                            {resource.product_name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentOptions?.map((payment, index) => {
                        return (
                          <SelectItem key={index} value={payment.value}>
                            {payment.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="valor"
                  className="placeholder:text-white"
                  value={`${formatCurrency(value | 0)}`}
                  onChange={(e) => handleValueChange(setValue, e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <Input
                    placeholder="Observação"
                    className="placeholder:text-zinc-600"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      ' w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span className="placeholder:text-zinc-600">
                        Selecione uma data
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <div className="flex w-full justify-end">
              {loading ? (
                <Button type="submit" className="bg-lime px-[38px]">
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
