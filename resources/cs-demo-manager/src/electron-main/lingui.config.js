import { formatter } from '@lingui/format-json';
const config = {
    locales: ['en', 'fr', 'es', 'pt-BR', 'zh-CN', 'zh-TW', 'de'],
    sourceLocale: 'en',
    rootDir: '.',
    format: formatter({ style: 'minimal' }),
    formatOptions: {
        lineNumbers: false,
    },
    orderBy: 'origin',
    catalogs: [
        {
            path: 'src/electron-main/translations/{locale}/messages',
            include: ['src/electron-main'],
        },
    ],
};
export default config;
//# sourceMappingURL=lingui.config.js.map