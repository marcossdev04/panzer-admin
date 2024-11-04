export interface Plan {
  id: string
  plan_name: string
  plan_code: string
  days: number
  product: {
    id: string
    product_name: string
    resource: null
    img_resource: null
    product_hot: boolean
  }
}
