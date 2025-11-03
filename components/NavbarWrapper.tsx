import dynamic from 'next/dynamic';

// Загружаем Navbar только на клиенте, полностью отключая SSR
// Это полностью решает проблему hydration mismatch
const Navbar = dynamic(() => import('./NavbarSimple'), {
  ssr: false,  // Ключевой момент - отключаем SSR полностью
  loading: () => null  // Не показываем placeholder, так как у нас есть CSS
});

export default Navbar;