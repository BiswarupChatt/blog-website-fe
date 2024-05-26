import { useAuth } from "../context/AuthContext"

export default function MyPost(){

    const {user} = useAuth()

    return(
        <>
        <h2>
            {user? user.firstName: 'enter name'}
        </h2>
        </>
    )
}