#!/usr/bin/env bash
# Baixa as imagens do site antigo (WordPress) para public/img com os nomes usados no site novo.
# Rode na raiz do projeto: bash scripts/baixar-imagens.sh
set -euo pipefail
B="https://condominiogranlago.com.br/wp-content/uploads"
D="public/img"
mkdir -p "$D/galeria"

baixar() { echo "-> $2"; curl -fsSL "$1" -o "$D/$2" || echo "   falhou: $1"; }

baixar "$B/2024/07/logo_sitenew.webp"            logo.webp
baixar "$B/2026/02/cropped-favicongran-270x270.png" ../favicon.png
baixar "$B/2026/02/webMapa-1024x762-1.webp"       mapa.webp
baixar "$B/2026/04/webenergia.webp"               dif-energia.webp
baixar "$B/2026/04/webmonitoramento.webp"         dif-monitoramento.webp
baixar "$B/2026/04/weblazer.webp"                 dif-lazer.webp
baixar "$B/2024/07/takedanew.webp"                logo-takeda.webp
baixar "$B/2024/05/alldesignnew.webp"             logo-alldesign.webp
baixar "$B/2026/03/weblogogran.webp"              logo-urbanizamos.webp
baixar "$B/2026/03/weblogovgv.webp"               logo-vgv.webp

for i in $(seq 1 30); do
  baixar "$B/2026/07/GRAN-LAGO-$i.webp" "galeria/gran-lago-$i.webp"
done

# Imagens de destaque reaproveitando a galeria (troque pelas melhores depois)
cp "$D/galeria/gran-lago-1.webp"  "$D/hero.webp"            2>/dev/null || true
cp "$D/galeria/gran-lago-2.webp"  "$D/conceito-1.webp"      2>/dev/null || true
cp "$D/galeria/gran-lago-3.webp"  "$D/conceito-2.webp"      2>/dev/null || true
cp "$D/galeria/gran-lago-4.webp"  "$D/conceito-3.webp"      2>/dev/null || true
cp "$D/galeria/gran-lago-5.webp"  "$D/tour.webp"            2>/dev/null || true
cp "$D/galeria/gran-lago-6.webp"  "$D/lazer-natureza.webp"  2>/dev/null || true
cp "$D/galeria/gran-lago-7.webp"  "$D/lazer-esporte.webp"   2>/dev/null || true
cp "$D/galeria/gran-lago-8.webp"  "$D/lazer-bemestar.webp"  2>/dev/null || true
cp "$D/galeria/gran-lago-9.webp"  "$D/lazer-gastronomia.webp" 2>/dev/null || true
cp "$D/galeria/gran-lago-10.webp" "$D/lazer-familia.webp"   2>/dev/null || true
cp "$D/galeria/gran-lago-11.webp" "$D/lazer-servicos.webp"  2>/dev/null || true
echo "Pronto. Confira as imagens em $D e troque as de destaque se quiser."
