import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: () => import('./pages/App'),
    });

    const style = document.createElement("style");
    style.textContent = `
        @media (max-width: 767px) {
        	div:has(> div[data-strapi-header]) {
        		height: unset !important;
			}

            div[data-strapi-header], div:has(> div[data-strapi-header]) + div {
                padding: 20px;
            }

            div:has(> div[data-strapi-header]) + div {
            	flex-wrap: wrap;
			}

            div[data-strapi-header] > div:last-of-type, div[data-strapi-header] > div:last-of-type * {
                flex-wrap: wrap;
            }

            #main-content:not(:has(main)) > div:last-child {
                padding: 20px;
            }
            nav[aria-label="Content Manager"], nav[aria-label="Content-Type Builder"], nav[aria-label="Plugin Contact S2EE"] {
                width: 100%;
                height: auto;
                position: inherit;
                top: inherit;
                border-right: none;
                border-bottom: 1px solid #4a4a6a;
                margin-bottom: 2rem;
            }
            a[href="#main-content"] + div > div > div {
	            grid-template-columns: repeat(1, minmax(0, 1fr));
            }

            main[aria-labelledby="main-content-title"]:not(:has(div[data-strapi-header="true"], div[data-strapi-header-sticky="true"])) {
                padding: 20px;
            }

            div[id="radix-:rp:-content-draft"] > div > div > div > div {
            	gap: unset;
			}

			div[data-strapi-header-sticky] {
				width: calc(100% - 55px);
			}

			div[data-strapi-header-sticky] > div, div[data-strapi-header-sticky] > div > div > div, div[data-strapi-header-sticky] > div > div > div > div {
				flex-wrap: wrap;
				gap: 10px;
				padding: 0;
			}

			body[data-scroll-locked] > div:last-of-type > div {
				width: 90%;
			}
       }
	`;
    document.head.appendChild(style);

    // app.addMenuLink({
    //   to: `plugins/${PLUGIN_ID}/companies`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.companies`,
    //     defaultMessage: 'Companies',
    //   },
    //   Component: async () => {  
    //     const CompanyList = await import('./pages/CompanyList');

    //     return CompanyList;
    //   },

    // }); 

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
