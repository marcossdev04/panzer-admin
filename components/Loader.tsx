import Image from 'next/image'
import loader from '@/assets/loader.svg'

export function Loader() {
  return <Image src={loader} width={20} className="animate-spin" alt="loader" />
}
