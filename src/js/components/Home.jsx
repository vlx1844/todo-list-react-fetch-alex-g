import React, { useState, useEffect } from "react";

const Home = () => {
    const [tareaNueva, setTareaNueva] = useState("");
    const [listaTareas, setListaTareas] = useState([]);
    const [mensajeError, setMensajeError] = useState("");

    
    const BASENAME = "https://playground.4geeks.com/todo";
    const USERNAME = "vlx1844"; 

    
    useEffect(() => {
        obtenerTareas();
    }, []);

    const obtenerTareas = async () => {
        try {
            const response = await fetch(`${BASENAME}/users/${USERNAME}`);
            
            if (response.status === 404) {
                console.log("El usuario no existe. Creando usuario...");
                await crearUsuario();
                return;
            }

            if (!response.ok) throw new Error("Error al obtener tareas");

            const data = await response.json();
            setListaTareas(data.todos || []); 
        } catch (error) {
            console.error(error);
        }
    };

    const crearUsuario = async () => {
        try {
            const response = await fetch(`${BASENAME}/users/${USERNAME}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) obtenerTareas();
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    
    const controlarTecla = async (e) => {
        if (e.key === "Enter") {
            if (tareaNueva.trim() === "") {
                setMensajeError("El campo no puede estar vacío");
            } else if (tareaNueva.trim().length < 3) {
                setMensajeError("La tarea debe tener al menos 3 caracteres");
            } else {
                
                try {
                    const nuevaTareaAPI = {
                        label: tareaNueva.trim(),
                        is_done: false
                    };

                    const response = await fetch(`${BASENAME}/todos/${USERNAME}`, {
                        method: "POST",
                        body: JSON.stringify(nuevaTareaAPI),
                        headers: { "Content-Type": "application/json" }
                    });

                    if (response.ok) {
                        setTareaNueva("");
                        setMensajeError("");
                        obtenerTareas(); 
                    }
                } catch (error) {
                    console.error("Error al añadir la tarea:", error);
                }
            }
        }
    };

    
    const borrarTarea = async (todoId) => {
        try {
            const response = await fetch(`${BASENAME}/todos/${todoId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                obtenerTareas(); /
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    
    const limpiarTodo = async () => {
        try {
            const response = await fetch(`${BASENAME}/users/${USERNAME}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setListaTareas([]);
                await crearUsuario(); 
            }
        } catch (error) {
            console.error("Error al limpiar todo:", error);
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
                        onKeyDown={controlarTecla}
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
                                    onClick={() => borrarTarea(todo.id)} 
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
                        <button className="btn btn-link text-danger p-0 m-0 text-decoration-none" style={{ fontSize: "12px" }} onClick={limpiarTodo}>
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