import React from 'react';

const LoginWithGoogle = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:4000/auth/google';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Prueba Tecnica Alertandote</h1>
            <button
                onClick={handleLogin}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
                Iniciar sesión con Google Para subir Archivos
            </button>
        </div>
    );
};

export default LoginWithGoogle;
