// radar-engine.js - MANTENDO A LÓGICA DE 2026
export const RadarEngine = {
    DICIONARIO: [
        { id: "AGRAVO DE PETIÇÃO", display: "AGRAVO DE PETIÇÃO", cor: "#f87171" },
        { id: "RECURSO ORDINÁRIO", display: "RECURSO ORDINÁRIO", cor: "#3b82f6" },
        { id: "CONTESTAÇÃO", display: "CONTESTAÇÃO TRABALHISTA", cor: "#22c55e" },
        { id: "RECLAMAÇÃO", display: "RECLAMATÓRIA TRABALHISTA", cor: "#a855f7" },
        { id: "EMBARGOS DE TERCEIRO", display: "EMBARGOS DE TERCEIRO", cor: "#a855f7" },
        { id: "MANDADO DE SEGURANÇA", display: "MANDADO DE SEGURANÇA", cor: "#0ea5e9" }
    ],

    analisar: (textoParaAnalise) => {
        if (!textoParaAnalise) return null;
        const txt = textoParaAnalise.toUpperCase();
        // A lógica de busca por ID dentro do texto permanece intacta
        return RadarEngine.DICIONARIO.find(p => txt.includes(p.id)) || null;
    },

    renderizar: (encontrado) => {
        const sidebarStatus = document.getElementById('radar-status');
        const topoFolha = document.getElementById('identificador-peca');
        
        if (encontrado) {
            // SÓ ESCREVE SE O ELEMENTO EXISTIR - ISSO É A BLINDAGEM
            if (sidebarStatus) { 
                sidebarStatus.innerHTML = `<span style="color:${encontrado.cor}">RADAR:</span> ${encontrado.id}`;
            }
            if (topoFolha) {
                topoFolha.innerText = encontrado.display;
                topoFolha.style.borderBottom = `3px solid ${encontrado.cor}`;
            }
        } else {
            if (sidebarStatus) sidebarStatus.innerHTML = `RADAR: <span style="color:#94a3b8">OFF</span>`;
            if (topoFolha) topoFolha.innerText = "CADERNO DE RESPOSTAS";
        }
    }
};
