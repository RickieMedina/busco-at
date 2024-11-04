import ListUser from "@/components/admin/list-user";

interface User {
    user_id: string
    name: string
    last_name: string
    email: string
    phone: string
    role: string
    profile_completed: boolean
    created_at: string
    updated_at: string
    is_active: boolean
  }


export default async function UsersPage() {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {cache: "no-store"});
    const users: User[] = await response.json();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Administración de usuarios</h1>
            <ListUser
                initialUsers={users}
            />
        </div>
    )
}