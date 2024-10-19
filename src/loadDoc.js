import axios from "axios"

export async function load_doc(DBID){
    const data =await axios.get(import.meta.env.VITE_API_URL+"/api/getdbid/"+DBID)
        .then((res)=>{return(res.data)})
        .catch((error)=>{
            console.log(error)
        })

    return data
}