export const SOBRE_INTRO_P1_PATH = "sobre.intro.paragraph1" as const
export const SOBRE_INTRO_P2_PATH = "sobre.intro.paragraph2" as const
export const SOBRE_MISSION_QUOTE_PATH = "sobre.mission.quote" as const
export const SOBRE_PRINCIPLES_PATH = "sobre.principles" as const

export const SOBRE_INTRO_P1_DEFAULT =
  "A empresa Silo Grão Equipamentos para armazenagem surgiu para atender especificamente a reposição de peças de equipamentos. Inicialmente com um vendedor interno, posteriormente foi criado o departamento comercial agregando outros produtos para comercialização, principalmente correias planas, agrícolas e industriais e vários outros itens para a área agrícola. Foi criada então uma equipe de vendedores externos para atuarem diretamente junto aos clientes fazendo levantamentos nos equipamentos já instalados visando a reposição de peças e a venda de outros produtos."

export const SOBRE_INTRO_P2_DEFAULT =
  "A atuação é desenvolvida pela equipe de vendas interna (Call Center) e externa, enquanto os pedidos são atendidos pela Central de distribuição de Peças de Francisco Beltrão, com sistema de logística."

export const SOBRE_MISSION_QUOTE_DEFAULT =
  "Oferecer soluções que agregam valor ao nosso produto, assegurando a satisfação dos nossos clientes."

const DEFAULT_PRINCIPLES = [
  "Melhorar continuamente nossos produtos e serviços.",
  "Promover o desenvolvimento dos nossos colaboradores.",
  "Garantir a satisfação dos nossos clientes.",
  "Liderar nosso mercado de atuação.",
  "Parcerias como estratégia de negócios.",
  "Diferenciar soluções de engenharia.",
  "Caracterizar nosso desempenho.",
  "Buscar a fidelização dos nossos clientes.",
] as const

export const SOBRE_PRINCIPLES_DEFAULT = DEFAULT_PRINCIPLES.join("\n")

export function parseSobrePrinciples(raw: string | undefined): string[] {
  if (!raw?.trim()) return [...DEFAULT_PRINCIPLES]
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length > 0 ? lines : [...DEFAULT_PRINCIPLES]
}

export function sobreFieldValue(
  content: Record<string, string>,
  path: string,
  fallback: string
) {
  return content[path]?.trim() || fallback
}
