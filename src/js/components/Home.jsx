import React, { useState, useEffect } from "react";

const Home = () => {
    const [tareaNueva, setTareaNueva] = useState("");
    const [listaTareas, setListaTareas] = useState([]);
    const [mensajeError, setMensajeError] = useState("");
    const [cargando, setCargando] = useState(false);

    const urlBase = "https://playground.4geeks.com/todo";
    const usuario = "vlx1844"; 

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        setCargando(true);
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
        } finally {
            setCargando(false);
        }
    };

    const inicializarUsuario = async () => {
        try {
            await fetch(`${urlBase}/users/${usuario}`, { method: "POST" });
            cargarTareas();
        } catch (error) {
            console.error("Error al inicializar:", error);
        }
    };

    const manejarTeclado = async (e) => {
        if (e.key === "Enter") {
            const textoLimpio = tareaNueva.trim();
            if (textoLimpio === "" || textoLimpio.length < 3) {
                setMensajeError("Mínimo 3 caracteres");
                return;
            }

            setCargando(true);
            try {
                const respuesta = await fetch(`${urlBase}/todos/${usuario}`, {
                    method: "POST",
                    body: JSON.stringify({ label: textoLimpio, is_done: false }),
                    headers: { "Content-Type": "application/json" }
                });
                if (respuesta.ok) {
                    setTareaNueva("");
                    cargarTareas();
                }
            } catch (error) {
                console.error("Error al guardar:", error);
            } finally {
                setCargando(false);
            }
        }
    };

    
    const alternarTarea = async (todo) => {
        setCargando(true);
        try {
            const respuesta = await fetch(`${urlBase}/todos/${todo.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    label: todo.label,
                    is_done: !todo.is_done 
                }),
                headers: { "Content-Type": "application/json" }
            });
            if (respuesta.ok) {
                cargarTareas();
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
        } finally {
            setCargando(false);
        }
    };

    const eliminarItem = async (id) => {
        setCargando(true);
        try {
            const respuesta = await fetch(`${urlBase}/todos/${id}`, { method: "DELETE" });
            if (respuesta.ok) cargarTareas();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setCargando(false);
        }
    };

    const vaciarListaCompleta = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch(`${urlBase}/users/${usuario}`, { method: "DELETE" });
            if (respuesta.ok) {
                setListaTareas([]);
                await inicializarUsuario();
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h1 className="text-center display-1 text-danger opacity-25">ToDo List</h1>
            
            <div className="shadow bg-white position-relative">
                
                {cargando && (
                    <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <div className="p-3 border-bottom">
                    <input
                        type="text"
                        className="form-control border-0 fs-4"
                        placeholder="¿Qué hay que hacer?"
                        value={tareaNueva}
                        onChange={(e) => setTareaNueva(e.target.value)}
                        onKeyDown={manejarTeclado}
                        disabled={cargando}
                    />
                </div>

                <ul className="list-group list-group-flush">
                    {mensajeError && <li className="list-group-item text-danger small">{mensajeError}</li>}

                    {listaTareas.length === 0 ? (
                        <li className="list-group-item text-secondary py-3">No hay tareas, añadir tareas</li>
                    ) : (
                        listaTareas.map((todo) => (
                            <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center py-3 tarea-item">
                                <div className="d-flex align-items-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input me-3" 
                                        checked={todo.is_done} 
                                        onChange={() => alternarTarea(todo)} 
                                    />
                                    <span style={{ textDecoration: todo.is_done ? "line-through" : "none", color: todo.is_done ? "gray" : "black" }}>
                                        {todo.label}
                                    </span>
                                </div>
                                <i className="fas fa-times icono-borrar" onClick={() => eliminarItem(todo.id)}></i>
                            </li>
                        ))
                    )}
                </ul>

                <div className="p-2 border-top text-secondary d-flex justify-content-between align-items-center" style={{ fontSize: "12px" }}>
                    <span>{listaTareas.length} items left</span>
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