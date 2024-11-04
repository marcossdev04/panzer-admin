export interface Staff {
  id: string
  last_login: string
  is_superuser: boolean
  phone: string
  active: boolean
  is_staff: boolean
  email: string
  name: string
  first_name: string
  last_name: string
  date_joined: string
  password: string
  cpf: string
  groups: []
  user_permissions: []
}
