# Plano: clone do site da FAEX em Astro

> Status: **estrutura inicial pronta** (Astro + Tailwind + GSAP). Home, cursos, eventos e notícias
> usam dados reais da API; demais páginas estão como "em construção".
> Conteúdo e imagens: `npm run sync` (API pública `https://api.faex.edu.br/v1` → `src/data/` e `public/images/`).
> Data: 2026-11-17
> Site de origem: https://faex.edu.br/

## 1. Objetivo

Recriar o site institucional da FAEX (Faculdade de Extrema) neste projeto Astro (`astro ^7.4`),
mantendo o mesmo conteúdo, estrutura de páginas e identidade visual, mas como site
estático/SSG rápido e bom para SEO.

## 2. O que já sabemos do site atual

### Tecnologia
- É uma **SPA (Single Page App) feita com Vite**: o HTML inicial vem praticamente vazio
  (`/assets/index-*.js` + `/assets/index-*.css`) e todo o conteúdo é montado no navegador.
- Imagens e arquivos ficam em `https://faex.edu.br/storage/...` (ex.: `storage/site/favicon.png`,
  `storage/site/og-image.png`), o que sugere um backend (provavelmente Laravel) servindo uma API.
- Integrações presentes no `<head>`/body:
  - Google Tag Manager (`GTM-WMQPLXLJ`)
  - Plugin de acessibilidade **VLibras** (`vlibras.gov.br/app/vlibras-plugin.js`)
  - `manifest.json` (PWA)
- **Consequência:** um fetch simples só devolve "FAEX - Faculdade de Extrema". Para capturar
  conteúdo/visual é preciso **renderizar no navegador** (headless/Chrome) ou ler a API usada pelo JS.

### SEO atual (manter)
- Title: `FAEX - Faculdade de Extrema`
- Description: "FAEX - Faculdade de Extrema. Cursos de Graduação, Pós-Graduação e Técnicos
  reconhecidos pelo MEC em Extrema, Minas Gerais."
- Open Graph / Twitter card com `og-image.png`, `og:locale = pt_BR`, canonical.

### Mapa de páginas (fonte: `sitemap.xml`, 21 URLs)

| Grupo | Rota | Prioridade |
|---|---|---|
| Home | `/` | 1.0 |
| Captação | `/vestibular` | 0.9 |
| Cursos | `/cursos` | 0.9 |
| Cursos | `/cursos/graduacao` | 0.8 |
| Cursos | `/cursos/pos-graduacao` | 0.8 |
| Cursos | `/cursos/tecnico` | 0.8 |
| Conteúdo | `/noticias` | 0.8 |
| Conteúdo | `/eventos` | 0.7 |
| Institucional | `/sobre` | 0.7 |
| Institucional | `/contato` | 0.7 |
| Serviços | `/biblioteca` | 0.6 |
| Serviços | `/clinica` | 0.6 |
| Serviços | `/nupac` | 0.6 |
| Serviços | `/egresso` | 0.6 |
| Carreira | `/oportunidades` | 0.6 |
| Carreira | `/empregos` | 0.6 |
| Institucional | `/cpa` | 0.5 |
| Institucional | `/documentos` | 0.5 |
| Institucional | `/ouvidoria` | 0.5 |
| Institucional | `/seja-parceiro` | 0.5 |
| Legal | `/politica-de-privacidade` | 0.3 |

Observação: o sitemap não lista páginas individuais de curso, notícia ou evento. Elas
provavelmente existem como rotas dinâmicas (ex.: `/cursos/graduacao/<slug>`, `/noticias/<slug>`)
e precisam ser descobertas na etapa de levantamento.

## 3. Ainda falta levantar (fazer antes de codar)

- [ ] Capturar cada página renderizada (screenshot desktop + mobile) com navegador.
- [ ] Inventário do **header/menu** (itens, submenus, links externos como portal do aluno).
- [ ] Inventário das **seções da home**, em ordem (banners/carrossel, cursos, CTAs, depoimentos, etc.).
- [ ] Inventário do **rodapé** (endereço, telefones, redes sociais, links, selo MEC).
- [ ] **Identidade visual**: cores (hex), fontes, logo, ícones, espaçamentos — extrair do CSS `index-*.css`.
- [ ] Descobrir a **API** que alimenta o site (aba Network): cursos, notícias, eventos, banners.
- [ ] Listar rotas dinâmicas reais (cursos, notícias, eventos) e quantos itens existem.
- [ ] Formulários existentes (contato, ouvidoria, vestibular, seja parceiro) e para onde enviam.
- [ ] Links externos (inscrição do vestibular, portal do aluno, biblioteca virtual etc.).

## 4. Decisões a tomar

1. **Fonte do conteúdo**
   - (a) Copiar o conteúdo para arquivos locais (Content Collections em Markdown/JSON); ou
   - (b) Buscar da API atual em build time (o site fica sempre atualizado com o painel deles).
2. **Estilo**: Tailwind CSS ou CSS próprio por componente.
3. **Imagens**: baixar para `src/assets` (otimização do Astro) ou apontar para `/storage` do site atual.
4. **Formulários**: para onde enviam no clone (API atual, serviço de formulário, e-mail, Supabase).
5. **Fidelidade**: cópia pixel a pixel ou mesma estrutura com melhorias de layout.
6. **Hospedagem/deploy** (ex.: Cloudflare Pages, Vercel, Netlify).

## 5. Arquitetura proposta (Astro)

```
src/
  layouts/
    BaseLayout.astro        # <head> com SEO, GTM, VLibras, header e footer
  components/
    Header.astro / Menu.astro
    Footer.astro
    Hero/Carousel.astro
    CourseCard.astro
    NewsCard.astro / EventCard.astro
    CtaVestibular.astro
    ContactForm.astro
  content/                  # se a decisão 4.1 for (a)
    cursos/  noticias/  eventos/
  pages/
    index.astro
    vestibular.astro
    cursos/index.astro
    cursos/[categoria]/index.astro      # graduacao | pos-graduacao | tecnico
    cursos/[categoria]/[slug].astro
    noticias/index.astro  noticias/[slug].astro
    eventos/index.astro   eventos/[slug].astro
    sobre.astro contato.astro biblioteca.astro clinica.astro nupac.astro
    egresso.astro oportunidades.astro empregos.astro cpa.astro
    documentos.astro ouvidoria.astro seja-parceiro.astro
    politica-de-privacidade.astro
public/
  favicon.png  manifest.json  og-image.png
```

Extras: `@astrojs/sitemap` para manter o sitemap e redirects se alguma URL mudar.

## 6. Etapas de execução (depois de aprovado)

1. **Levantamento** (seção 3): screenshots, tokens visuais e inventário de conteúdo/API.
2. **Base**: layout, tokens de cor/fonte, Header, Footer, SEO, GTM, VLibras.
3. **Home**, comparando lado a lado com o site original.
4. **Páginas de cursos** (listagens + página de curso).
5. **Vestibular** (página de maior conversão).
6. **Notícias e eventos** (listagem + detalhe).
7. **Páginas institucionais e de serviços** (as 12 restantes).
8. **Formulários**.
9. **QA**: responsivo, acessibilidade, Lighthouse, links quebrados, comparação com o original.
10. **Deploy**.

## 7. Skills que podem ajudar (pesquisadas com `npx skills find`)

| Skill | Instalações | Uso |
|---|---|---|
| `astrolicious/agent-skills@astro` | 19.8K | Boas práticas de Astro |
| `firecrawl/firecrawl-workflows@firecrawl-website-design-clone` | 33.6K | Captura/clone de design (exige conta Firecrawl) |
| `julianromli/ai-skills@clone-website` | 2.3K | Fluxo de clone de site |
| `coreyhaines31/marketingskills@site-architecture` | 136.1K | Arquitetura de páginas/navegação |

Nenhuma foi instalada. Instalar com `npx skills add <owner/repo@skill>` se aprovar.

## 8. Cuidados

- Usar o conteúdo e a marca da FAEX só com autorização da instituição (confirmar que o projeto é
  para a própria FAEX).
- Não copiar o ID do GTM nem os formulários para produção sem combinar com quem administra o site atual.
