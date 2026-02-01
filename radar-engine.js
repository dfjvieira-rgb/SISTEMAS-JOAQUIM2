// radar-engine.js - Inteligência de Detecção Elite [cite: 2026-01-30]
export const RadarEngine = {
    DICIONARIO: [
        { id: "AGRAVO DE PETIÇÃO", display: "AGRAVO DE PETIÇÃO", cor: "#f87171" },
        { id: "RECURSO ORDINÁRIO", display: "RECURSO ORDINÁRIO", cor: "#3b82f6" },
        { id: "CONTESTAÇÃO", display: "CONTESTAÇÃO TRABALHISTA", cor: "#22c55e" },
        { id: "RECLAMAÇÃO", display: "RECLAMATÓRIA TRABALHISTA", cor: "#a855f7" },
        { id: "MANDADO DE SEGURANÇA", display: "MANDADO DE SEGURANÇA", cor: "#0ea5e9" }
    ],

    analisar: (textoParaAnalise) => {
        const txt = textoParaAnalise.toUpperCase();
        return RadarEngine.DICIONARIO.find(p => txt.includes(p.id)) || null;
    },

    renderizar: (encontrado) => {
        const sidebarStatus = document.getElementById('radar-status');
        const topoFolha = document.getElementById('identificador-peca');
        
        if (encontrado) {
            sidebarStatus.innerHTML = `<span style="color:${encontrado.cor}">RADAR</span><br>${encontrado.id}`;
            topoFolha.innerText = encontrado.display;
            topoFolha.style.color = encontrado.cor;
        } else {
            sidebarStatus.innerHTML = `<span>RADAR</span><br><span class="radar-blink">BUSCANDO...</span>`;
            topoFolha.innerText = "CADERNO DE RESPOSTAS";
            topoFolha.style.color = "#64748b";
        }
    }
};
