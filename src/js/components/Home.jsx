import React, { useState, useEffect } from "react";

const Home = () => {
    const [tareaNueva, setTareaNueva] = useState("");
    const [listaTareas, setListaTareas] = useState([]);
    const [mensajeError, setMensajeError] = useState("");

    const urlBase = "https://playground.4geeks.com/todo";
    const usuario = "tu-usuario"; 

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            const respuesta = await fetch(`${urlBase}/users/${usuario}`);
            
            if (respuesta.status === 404) {
                await inicializarUsuario();
                return;
            }

            if (!respuesta.ok) throw new Error();

            const datos = await respuesta.json();
            setListaTareas(datos.todos || []); 
        } catch (error) {
            console.error("Error al cargar:", error);
        }
    };

    const inicializarUsuario = async () => {
        try {
            const respuesta = await fetch(`${urlBase}/users/${usuario}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (respuesta.ok) {
                cargarTareas();
            }
        } catch (error) {
            console.error("Error al inicializar:", error);
        }
    };

    const manejarTeclado = async (e) => {
        if (e.key === "Enter") {
            const textoLimpio = tareaNueva.trim();

            if (textoLimpio === "") {
                setMensajeError("El campo no puede estar vacío");
                return;
            } 
            
            if (textoLimpio.length < 3) {
                setMensajeError("La tarea debe tener al menos 3 caracteres");
                return;
            }

            try {
                const estructuraTarea = {
                    label: textoLimpio,
                    is_done: false
                };

                const respuesta = await fetch(`${urlBase}/todos/${usuario}`, {
                    method: "POST",
                    body: JSON.stringify(estructuraTarea),
                    headers: { "Content-Type": "application/json" }
                });

                if (respuesta.ok) {
                    setTareaNueva("");
                    setMensajeError("");
                    cargarTareas(); 
                }
            } catch (error) {
                console.error("Error al guardar:", error);
            }
        }
    };

    const eliminarItem = async (id) => {
        try {
            const respuesta = await fetch(`${urlBase}/todos/${id}`, {
                method: "DELETE"
            });

            if (respuesta.ok) {
                cargarTareas(); 
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const vaciarListaCompleta = async () => {
        try {
            const respuesta = await fetch(`${urlBase}/users/${usuario}`, {
                method: "DELETE"
            });
            if (respuesta.ok) {
                setListaTareas([]);
                await inicializarUsuario(); 
            }
        } catch (error) {
            console.error("Error al vaciar:", error);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h1 className="text-center display-1 text-danger opacity-25">ToDo List</h1>
            
            <div className="shadow bg-white">
                <div className="p-3 border-bottom">
                    <input
                        type="text"
                        className="form-control border-0 fs-4"
                        placeholder="¿Qué hay que hacer?"
                        value={tareaNueva}
                        onChange={(e) => {
                            setTareaNueva(e.target.value);
                            if (mensajeError) setMensajeError("");
                        }}
                        onKeyDown={manejarTeclado}
                    />
                </div>

                <ul className="list-group list-group-flush">
                    {mensajeError && (
                        <li className="list-group-item text-danger py-3 tarea-item">
                            {mensajeError}
                        </li>
                    )}

                    {listaTareas.length === 0 && !mensajeError ? (
                        <li className="list-group-item text-secondary py-3 tarea-item">
                            No hay tareas, añadir tareas
                        </li>
                    ) : (
                        listaTareas.map((todo) => (
                            <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center py-3 tarea-item">
                                {todo.label}
                                <i 
                                    className="fas fa-times icono-borrar" 
                                    style={{ cursor: "pointer" }}
                                    onClick={() => eliminarItem(todo.id)} 
                                ></i>
                            </li>
                        ))
                    )}
                </ul>

                <div className="p-2 border-top text-secondary d-flex justify-content-between align-items-center" style={{ fontSize: "12px" }}>
                    <span>
                        {listaTareas.length} {listaTareas.length === 1 ? "item" : "items"} left
                    </span>
                    {listaTareas.length > 0 && (
                        <button className="btn btn-link text-danger p-0 m-0 text-decoration-none" style={{ fontSize: "12px" }} onClick={vaciarListaCompleta}>
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>

            <div className="mx-auto bg-white border shadow-sm" style={{ height: "5px", width: "98%" }}></div>
            <div className="mx-auto bg-white border shadow-sm" style={{ height: "5px", width: "96%" }}></div>
        </div>
    );
};

export default Home;