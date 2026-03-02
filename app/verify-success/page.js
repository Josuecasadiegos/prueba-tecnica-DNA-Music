export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 p-10 text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            ¡Cuenta Verificada!
          </h1>
          
          <p className="text-gray-300 text-lg mb-8">
            Tu correo electrónico ha sido confirmado exitosamente. 
            Ahora puedes disfrutar de todas las funciones de DNA Music.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/30"
          >
            Iniciar Sesión
          </a>
          
          <a
            href="/dashboard"
            className="block w-full py-4 bg-transparent border-2 border-indigo-600 text-indigo-400 hover:bg-indigo-600/10 font-medium rounded-xl transition-all duration-300"
          >
            Ir al Dashboard
          </a>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          Gracias por unirte a DNA Music 🎵
        </p>
      </div>
    </div>
  );
}