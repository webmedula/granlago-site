# Gran Lago · site

Site do **Gran Lago Condomínio Horizontal** (Urbanizamos), feito em [Astro](https://astro.build) com animações em [GSAP](https://gsap.com) e rolagem suave com [Lenis](https://lenis.darkroom.engineering). Substitui o site antigo em WordPress + Divi.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera o site estático em dist/
```

## Imagens

As imagens não estão no repositório ainda. Para puxar as do site antigo com os nomes certos:

```bash
bash scripts/baixar-imagens.sh
```

Enquanto uma imagem não existir, o site mostra um degradê verde no lugar. As imagens de destaque (`hero`, `conceito-*`, `tour`, `lazer-*`) são cópias da galeria; troque pelas melhores. Para um vídeo aéreo no topo, veja o comentário em `src/components/Hero.astro`.

## Onde editar o conteúdo

- `src/data/site.ts`: textos, contatos, WhatsApp, links, lazer, diferenciais, galeria.
- `src/data/obras.ts`: andamento das obras (percentual e data de atualização).
- Itens marcados com `CONFIRMAR` precisam ser validados antes de publicar.

## Publicação (Netlify)

1. Netlify → Add new site → Import from GitHub → `webmedula/granlago-site`. O `netlify.toml` já define build e redirecionamentos.
2. Em Forms, ative as notificações por e-mail do formulário `contato` (os leads chegam lá).
3. Aponte o domínio `condominiogranlago.com.br` para o Netlify quando aprovado.
4. Antes de trocar o domínio, copie a pasta `tour360/` do servidor antigo para `public/tour360/` e troque o link em `site.ts` para `/tour360/index.htm`.

## Estrutura

```
src/
  components/   seções da página (Hero, Lazer, Obras, Contato...)
  data/         conteúdo editável
  layouts/      <head>, SEO, GTM, schema
  pages/        /, /galeria, /obras, /politica-de-privacidade, /obrigado
  scripts/      animações e interações
```
