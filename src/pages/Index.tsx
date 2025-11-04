import DinoGame from '@/components/DinoGame';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-mono">
            🦖 DINO GAME
          </h1>
          <p className="text-gray-600 text-lg">
            Классическая игра из браузера Chrome
          </p>
        </div>

        <DinoGame />

        <div className="max-w-4xl mx-auto mt-16">
          <Card className="p-8 bg-white border-2 border-gray-800 shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <Icon name="Gamepad2" size={32} className="text-gray-800 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-mono">
                  Управление
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center gap-3">
                    <kbd className="px-4 py-2 bg-gray-800 text-white rounded font-mono text-sm shadow-md">
                      ПРОБЕЛ
                    </kbd>
                    <span className="text-lg">— прыжок</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <kbd className="px-4 py-2 bg-gray-800 text-white rounded font-mono text-sm shadow-md">
                      КЛИК
                    </kbd>
                    <span className="text-lg">— прыжок (альтернатива)</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-mono">
                    Правила игры
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-800 font-bold">•</span>
                      <span>Прыгай через кактусы и набирай очки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-800 font-bold">•</span>
                      <span>С каждым уровнем игра становится быстрее</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-800 font-bold">•</span>
                      <span>Постарайся побить свой рекорд!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
