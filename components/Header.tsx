'use client'
import Link from 'next/link'
import { CircleUser, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import logo from '@/assets/HeaderLogo.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/store/UseAuth'

export function Header() {
  const { handleSignOut } = useAuth()
  const pathname = usePathname()
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <nav className=" flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 mobile:hidden">
        <Image className="w-[120px] mobile:w-[100px]" src={logo} alt="logo" />
        <Link
          href="/admin/home"
          className={`${
            pathname === '/admin/home' ? 'text-lime' : 'text-muted-foreground'
          } transition-colors hover:text-lime`}
        >
          Início
        </Link>
        <Link
          href="/admin/clients"
          className={`${
            pathname === '/admin/clients'
              ? 'text-lime'
              : 'text-muted-foreground'
          } transition-colors hover:text-lime`}
        >
          Clientes
        </Link>
        <Link
          href="/admin/logs"
          className={`${
            pathname === '/admin/logs' ? 'text-lime' : 'text-muted-foreground'
          } transition-colors  hover:text-lime`}
        >
          Logs
        </Link>
        <Link
          href="/admin/users"
          className={`${
            pathname === '/admin/users' ? 'text-lime' : 'text-muted-foreground'
          } transition-colors  hover:text-lime`}
        >
          Funcionários
        </Link>
        <Link
          href="/admin/plans"
          className={`${
            pathname === '/admin/plans' ? 'text-lime' : 'text-muted-foreground'
          } transition-colors  hover:text-lime`}
        >
          Planos
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center justify-center">
              <Image className=" mobile:w-[150px]" src={logo} alt="logo" />
            </div>
            <Link
              href="/admin/home"
              className={`${
                pathname === '/admin/home'
                  ? 'text-lime'
                  : 'text-muted-foreground'
              } transition-colors hover:text-lime`}
            >
              Início
            </Link>
            <Link
              href="/admin/clients"
              className={`${
                pathname === '/admin/clients'
                  ? 'text-lime'
                  : 'text-muted-foreground'
              } transition-colors hover:text-lime`}
            >
              Clientes
            </Link>
            <Link
              href="/admin/logs"
              className={`${
                pathname === '/admin/logs'
                  ? 'text-lime'
                  : 'text-muted-foreground'
              } transition-colors  hover:text-lime`}
            >
              Logs
            </Link>
            <Link
              href="/admin/users"
              className={`${
                pathname === '/admin/users'
                  ? 'text-lime'
                  : 'text-muted-foreground'
              } transition-colors  hover:text-lime`}
            >
              Funcionários
            </Link>
            <Link
              href="/admin/plans"
              className={`${
                pathname === '/admin/plans'
                  ? 'text-lime'
                  : 'text-muted-foreground'
              } transition-colors  hover:text-lime`}
            >
              Planos
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="tablet:hidden laptop:hidden desktop:hidden">
        <Image src={logo} alt="logo" width={100} />
      </div>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial"></form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5 text-lime" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
