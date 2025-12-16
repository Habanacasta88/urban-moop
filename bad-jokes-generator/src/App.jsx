import { useState, useEffect } from 'react'

const BAD_JOKES = [
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Cuál es el último animal que subió al arca de Noé? El del-fin.",
  "¿Cómo se dice pañuelo en japonés? Sakai moko.",
  "¿Qué le dice un gusano a otro? Me voy a dar una vuelta a la manzana.",
  "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
  "¿Qué le dice una iguana a su hermana gemela? Somos iguanitas.",
  "¿Cuál es el colmo de un electricista? Que no le sigan la corriente.",
  "¿Qué le dice un semáforo a otro? ¡No me mires que me estoy cambiando!",
  "¿Por qué el libro de matemáticas se suicidó? Porque tenía muchos problemas.",
  "¿Qué hace un perro con un taladro? Taladrando.",
  "¿Cómo se llama el campeón de buceo japonés? Tokofondo.",
  "¿Qué le dice una pared a otra pared? Nos vemos en la esquina.",
  "¿Por qué las focas del circo miran siempre hacia arriba? Porque es donde están los focos.",
  "¿Qué le dice un vaquero a su hija? ¡Hija, va-quera!",
  "¿Cuál es el baile favorito del tomate? La sal-sa.",
  "¿Cómo se despiden los químicos? Ácido un placer.",
  "¿Qué hace un mudo bailando? Mudanza.",
  "¿Cuál es el café más peligroso del mundo? El ex-preso.",
  "¿Qué le dijo una pulga a otra pulga? ¿Vamos a pie o esperamos al perro?",
  "¿Qué hace una vaca pensando en la noche? Moooo... chada."
];

function App() {
  const [joke, setJoke] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const generateJoke = () => {
    const randomIndex = Math.floor(Math.random() * BAD_JOKES.length);
    setJoke(BAD_JOKES[randomIndex]);
    setTimeLeft(60);
  };

  useEffect(() => {
    generateJoke(); // Initial joke
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateJoke();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="glass-panel max-w-2xl w-full rounded-3xl p-8 relative z-10 text-center border border-white/10 shadow-2xl flex flex-col items-center backdrop-blur-xl bg-white/5">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300 text-sm font-bold tracking-widest uppercase mb-6">
          Generador de Ideas: Malos Chistes
        </h1>

        <div className="min-h-[200px] flex items-center justify-center mb-8 w-full">
          <p key={joke} className="text-3xl md:text-5xl font-bold text-white leading-tight animate-fade-in">
            “{joke}”
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>

        <div className="flex flex-col items-center gap-2 text-white/50 text-sm">
          <p>Próximo chiste en {timeLeft} segundos</p>
          <button
            onClick={generateJoke}
            className="cursor-pointer mt-4 px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors backdrop-blur-sm active:scale-95"
          >
            Generar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
