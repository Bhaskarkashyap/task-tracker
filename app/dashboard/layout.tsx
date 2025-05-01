import Navbar from "@/components/navbar"
import  Sidebar  from "@/components/sidebar"


const DashboardLayout = ({
    children
}:{
    children : React.ReactNode
}) =>{
return(
    <div className="h-full relative">
    <div className="hidden md:flex md:w-52 md:flex-col md:fixed md:inset-y-0 z-[80] border-r-2">
   <Sidebar />
    </div>
    <main className="md:pl-52">
        {children}
    </main>
    </div>
)
}

export default DashboardLayout