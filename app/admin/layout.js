import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }) {
  const user = await currentUser()

  // Not logged in
  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
