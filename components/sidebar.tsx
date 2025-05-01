"use client"

import { LayoutDashboard, MessageSquare, Settings, Music, VideoIcon, Code, ImageIcon, UsersRound } from "lucide-react"

import Link from "next/link"
import { Montserrat } from "next/font/google";
import { cn } from '@/lib/utils'
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";


const  font = Montserrat({
  weight:"600",
  subsets:["latin"]
})

const routes = [
  {
    label : "Dashboard",
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-gray'
  },
  {
    label : "Inbox",
    icon: MessageSquare,
    href: '/Inbox',
    color: 'text-gray'
  },
  {
    label:'Teams',
    icon: UsersRound,
    color: 'text-gray',
    bgColor: 'bg-gray',
    href:'/music'
  },
  {
    label : "Settings",
    icon: Settings,
    href: '/setting',
  },
]

const Sidebar = () => {

  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full ">
    <div className="px-3 py-2 flex-1">
        <Link href='/dashboard' className="flex items-center pl-3 mb-14">
       
          <h1 className="text-2xl font-bold">TaskBot</h1>
        </Link>

        <div className="space-y-1">
        {routes.map((route) => (
          <Link 
          href={route.href}
          key={route.href}
          className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:scale-105" , pathname=== route.href ? ' bg-zinc-400/10 rounded-sm' : 'text-black hover:bg-zinc-400/10 rounded-sm')}
          >
            <div className="flex items-center flex-1">
           <route.icon className={cn("h-5 w-5 mr-3", route.color,  pathname=== route.href ? 'fill-black' : 'fill-none')} />
           {route.label}
            </div>
          </Link>
        ))}
        </div>
    </div>

    <div className=" p-2">
    <Button className="w-full">Upgrade</Button>
    </div>
    </div>
  )
}

export default Sidebar