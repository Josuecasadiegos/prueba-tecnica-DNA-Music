'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get('error');
  const already = searchParams.get('already');

  useEffect(() => {
    if (error || already) {
      // No redirigir automáticamente si hay error
      return;
    }
    // Si no hay params → quizás loading inicial, pero como la API redirige, rara vez llega aquí
  }, [error, already, router]);

  if (error) {
    let message = 'Ocurrió un error al verificar tu correo.';
    if (error === 'no-token') message = 'Falta el token de verificación.';
    if (error === 'invalid-token') message = 'El enlace es inválido o ha expirado.';
    if (error === 'user-not-found') message = 'Usuario no encontrado.';
    if (error === 'server-error') message = 'Error en el servidor. Intenta más tarde.';

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 p-10 text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-6">Error en la verificación</h1>
          <p className="text-gray-300 text-lg mb-8">{message}</p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-900/30"
          >
            Volver al Inicio de Sesión
          </a>
        </div>
      </div>
    );
  }

  if (already === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 p-10 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-6">¡Ya estás verificado!</h1>
          <p className="text-gray-300 text-lg mb-8">
            Tu cuenta ya fue confirmada anteriormente.
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-900/30"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  // Loading state (por si llega aquí directamente)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="text-center">
        <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white">Verificando tu correo...</h2>
      </div>
    </div>
  );
}