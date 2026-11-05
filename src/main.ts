import './style.css';
import { initApp } from './ui/app';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp(document.body);
  });
} else {
  initApp(document.body);
}
