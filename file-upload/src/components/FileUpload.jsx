import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
 
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar el loader
    const [uploadedFiles, setUploadedFiles] = useState([]); // Estado para almacenar archivos subidos    
    const fileInputRef = useRef(null); // Referencia para el input de archivo


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
 
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Seleccione un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true); // Mostrar el loader al iniciar la carga

        try {
            const response = await axios.post('http://localhost:4000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,  
            });

            const fileUrl = response.data.file;  
            setUploadedFiles(prevFiles => [...prevFiles, fileUrl]); 
            setMessage('Archivo Subido Correctamente');
            console.log(response.data);
          
        } catch (error) {
            setMessage('Error al subir el archivo');
            console.error(error);
        } finally {
            setLoading(false); // Limpiar Todo
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";  
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="p-6 bg-gray-100 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef} 
                    className="block w-full text-sm text-gray-600
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100 mb-4"
                               
                />
                <button
                    disabled  = {loading}
                    onClick={handleUpload}
                    className={`${file === null ? 'bg-blue-600' : 'bg-green-600'} w-full text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors`}
                >
                    Upload
                </button>

                <p className="mt-4 text-sm text-gray-700">{message}</p>

                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="loader"></div>
                    </div>
                )}

                {/* Lista de Archivos Subidos */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Archivos Subidos:</h3>
                    <ul className="list-disc list-inside">
                        {uploadedFiles.map((fileUrl, index) => (
                            <li key={index}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {fileUrl}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

 
        </div>
    );
};

export default FileUpload;
