'use client'

import "@/app/globals.css"

import { useEffect, useState } from "react"

export default function List(){

    const [user, setUser] = useState([])
    const [yesEdit, setYesEdit] = useState(null)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [create, setCreate] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function getData(){
            try{
                const response = await fetch("http://localhost:3333/api/",{
                    method: 'GET'
                })
                const data = await response.json()
                console.log(data)
                setUser(data)
                console.log(data)
            }catch(error){
                console.log(error)
            }
            
        }
        getData()

    }, [])

    async function deleteData(idUser){
        try{
            const response = await fetch('http://localhost:3333/api/delete', {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({id: idUser})
                
            })
            
            if(!response.ok){
                throw new Error(`Erro: ${response.status} - ${response.statusText}`)
            }

            setUser(prevUsers => prevUsers.filter(user => user.id !== idUser)) // O que faz a página mostrar automáticamente quando um item é deletado busca todos os itens com o "id" diferente do item que foi deletado

        }catch(error){
            console.error('Erro ao deletar', error)
        }
    }

    function edit(id){
        const userEdit  = user.find((value) => value.id === id )
        setYesEdit(prevId => prevId === id ? null : id )

        if(userEdit){
            setEmail(userEdit.email)
            setName(userEdit.name)
        }

           
    }

    async function editValues(name, email, id){

        try{
            const response = await fetch('http://localhost:3333/api/edit', {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name:name, email:email, id:id})
            })
    
            if(!response.ok){
                throw new Error(`Erro: ${response.status} - ${response.statusText}`)
            }


            setUser(prevUsers =>
                prevUsers.map(user =>
                    user.id === id ? { ...user, name, email } : user
                )
            );

            


            setYesEdit(null)
           
    
        }catch(error){
            console.error('Error oao editar', error)
        }      

    }

    function showCreate(){

        if(create === true) {
            setCreate(false)
        }else{
            setCreate(true)
        }

        
    }

    async function createUser(event){

        event.preventDefault()

        const data = new FormData(event.target)
        const email = data.get('email')
        const name = data.get('name')

        const response = await fetch('http://localhost:3333/api/create', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email})
        })

        if(!response.ok){
            console.log('Erro ao criar o usuário - ')
        }

        const newUser = await response.json()
        
        setUser(prevUsers => [...prevUsers, newUser]);

        setCreate(false)
        event.target.reset();
    }

    const filteredUsers = user.filter((value) =>
        value.name.toLowerCase().includes(search.toLowerCase()) ||
        value.email.toLowerCase().includes(search.toLowerCase())
    );



    return(
        <div className="mt-5">
            <div className="flex justify-end mb-5 flex-col">
                <div className="flex justify-between">
                    <input type="text" className="border-2 w-1/3 rounded-lg" value={search} onChange={(value) => setSearch(value.target.value) } />
                    <button className="bg-green-600 text-white p-2 rounded-lg w-24" onClick={() => showCreate()}>{create === false ? "+ Criar" : "Fechar"}</button>
                </div>
                {
                    create ? (
                    <form className="flex flex-col my-8 w-1/3" onSubmit={createUser}>
                        <label htmlFor="" className="">Nome</label>
                        <input type="text" className="border-2 border-width p-1 rounded-lg" name="name" />
                        <label htmlFor="" className="">email</label>
                        <input type="text" className="border-2 border-width p-1 rounded-lg mb-3" name="email" />
                        <div className="flex justify-end">
                            <button className="bg-green-600 w-1/3 rounded-lg text-white p-1 font-medium" type="submit">Enviar</button>
                        </div>
                    </form>
                    ) : null
                }


            </div>
            {
                filteredUsers.length > 0 ? 
                    filteredUsers.map((value) => {
                        return(
                            <div key={value.id} className="mb-3">
                                <div className="p-2 border-solid border-2 rounded-lg flex justify-between">
                                    <div>
                                        <p className="font-medium">{value.name}</p>
                                        <p>{value.email}</p>
                                    </div>
                                    <div className="flex w-52 justify-between">
                                        <button onClick={() => deleteData(value.id)} className="bg-red-600 text-white p-1 rounded-lg w-24">Deletar</button>
                                        <button onClick={() => edit(value.id)} className="bg-blue-600 text-white p-1 rounded-lg w-24">{yesEdit === value.id ? "Fechar" : "Editar"}</button>
                                    </div>
                                </div>
                                {
                                    yesEdit === value.id ? (
                                    <div className="mt-3 flex gap-2 flex-col w-1/4 pl-5 mb-8">
                                    <label htmlFor="" className="">Nome</label>
                                    <input type="text" className="border-2 border-width p-1 rounded-lg" name="nome" value={name} onChange={(value) => setName(value.target.value)} />
                                    <label htmlFor="" className="">email</label>
                                    <input type="text" className="border-2 border-width p-1 rounded-lg" name="email" value={email} onChange={(value) => setEmail(value.target.value)} />
                                    <div className="flex justify-end h-8 mt-2 font-medium text-white">
                                        <button className="bg-green-600 w-1/3 rounded-lg" type="submit"  onClick={() => editValues(name, email, value.id)}>Enviar</button>
                                    </div>
                                </div>
                                    ) : null
                                }
                                
                            </div>
                        )
                    })
                : (
                    <div className="text-red-500 font-medium">Po.. Não tem dados</div>
                )
            }
        </div>
    )
}