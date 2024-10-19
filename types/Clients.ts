export interface Clients {
  id: string
  email: string
  phone_number: string
  cpf: string
  name: string
  products: [
    {
      id: string
      resources: {
        product_name: string
        resource: string
        img_resource: string
      }
      active: boolean
      created_at: string
      updated_at: string
      billet_number: string
      status: string
      activated_date: string
      ended_date: string
      canceled_date: string
      contract_period_days: string
      contract_period_start_date: string
      contract_period_end_date: string
      user: string
    },
  ]
}
