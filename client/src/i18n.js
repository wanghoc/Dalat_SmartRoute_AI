import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// =============================================================================
// Translation Resources
// =============================================================================

const resources = {
    ko: {
        translation: {
            nav: {
                home: '홈',
                weather: '날씨',
                recs: 'AI 추천',
                local: '로컬 맛집',
                intro: '달랏',
                community: '커뮤니티'
            },
            auth: {
                login: '로그인',
                logout: '로그아웃',
                profile: '내 프로필'
            },
            language: {
                select: '언어 선택',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    en: {
        translation: {
            nav: {
                home: 'Home',
                weather: 'Weather',
                recs: 'AI Recs',
                local: 'Local Eats',
                intro: 'Dalat',
                community: 'Community'
            },
            auth: {
                login: 'Login',
                logout: 'Logout',
                profile: 'My Profile'
            },
            language: {
                select: 'Select Language',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    vi: {
        translation: {
            nav: {
                home: 'Trang chủ',
                weather: 'Thời tiết',
                recs: 'AI Gợi ý',
                local: 'Ẩm thực',
                intro: 'Đà Lạt',
                community: 'Cộng đồng'
            },
            auth: {
                login: 'Đăng nhập',
                logout: 'Đăng xuất',
                profile: 'Hồ sơ'
            },
            language: {
                select: 'Chọn ngôn ngữ',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    fr: {
        translation: {
            nav: {
                home: 'Accueil',
                weather: 'Météo',
                recs: 'IA Recs',
                local: 'Cuisine',
                intro: 'Dalat',
                community: 'Communauté'
            },
            auth: {
                login: 'Connexion',
                logout: 'Déconnexion',
                profile: 'Mon Profil'
            },
            language: {
                select: 'Choisir la langue',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    zh: {
        translation: {
            nav: {
                home: '首页',
                weather: '天气',
                recs: 'AI推荐',
                local: '美食',
                intro: '大叻',
                community: '社区'
            },
            auth: {
                login: '登录',
                logout: '退出',
                profile: '我的资料'
            },
            language: {
                select: '选择语言',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    }
};

// =============================================================================
// i18n Configuration
// =============================================================================

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ko', // Default language: Korean
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
