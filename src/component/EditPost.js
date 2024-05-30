import ReactQuill from "react-quill"
import { useParams } from "react-router-dom"

export default function EditPost (){
    return (
        <>
            <form >
                <label htmlFor="title">Enter Title</label>
                <input type="text" />
                
                <label htmlFor="title">Enter Title</label>
                <ReactQuill type="text" />

            </form>
        </>
    )
}