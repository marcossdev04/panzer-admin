'use client'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/store/UseAuth'
import bgLogin from '@/assets/bgLogin.png'
import { Loader } from '@/components/Loader'
import Image from 'next/image'
import logo from '@/assets/HeaderLogo.png'

interface FormData {
  email: string
  password: string
}

export default function LoginForm() {
  const { handleSignIn, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    handleSignIn(data)
  }
  const [isMobile, setIsMobile] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      setIsKeyboardVisible(true)
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const handleBlur = () => {
      setIsKeyboardVisible(false)
    }

    const inputs = document.querySelectorAll('input')
    inputs.forEach((input) => {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    })

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      })
    }
  }, [])

  return (
    <div
      className={`relative flex h-[100vh] items-center justify-center mobile:h-[90vh] ${
        isKeyboardVisible ? 'pb-[200px]' : ''
      }`}
      style={{
        backgroundImage: isMobile ? 'none' : `url(${bgLogin.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card
        ref={formRef}
        className="absolute w-[400px] border-none bg-transparent shadow-none mobile:relative mobile:bottom-0 mobile:left-0 mobile:w-[90vh] mobile:bg-black laptop:left-[200px] laptop:top-[350px] desktop:left-[320px] desktop:top-[500px] desktop:w-[500px]"
      >
        <CardTitle className="flex justify-center tablet:hidden laptop:hidden desktop:hidden">
          <Image src={logo} width={200} alt="logo" />
        </CardTitle>
        <CardContent className="mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-lime">
                  Email
                </Label>
                <Input
                  className=" focus-visible:ring-lime"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Insira um email válido',
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-sm text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-lime">
                    Senha
                  </Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-lime underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  className="focus-visible:ring-lime"
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                  })}
                />
                {errors.password && (
                  <span className="text-sm text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              {isLoading ? (
                <Button className="bg flex w-full justify-center gap-1 bg-lime hover:bg-lime hover:bg-opacity-80 active:bg-lime">
                  <Loader />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className=" bg flex w-full justify-center gap-1 bg-lime hover:bg-lime hover:bg-opacity-80"
                >
                  <div>Login</div>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
