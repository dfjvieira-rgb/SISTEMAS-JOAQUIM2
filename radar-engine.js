// radar-engine.js - Inteligência de Detecção [cite: 2026-01-30]
export const RadarEngine = {
    analisar: (linhas) => {
        const textoCompleto = linhas.join(" ").toUpperCase();
        
        // Regras de Identificação (Extraídas das Peças Oficiais) [cite: 2026-01-26]
        if (textoCompleto.includes("RECURSO ORDINÁRIO")) return "RECURSO ORDINÁRIO";
        if (textoCompleto.includes("CONTESTAÇÃO")) return "CONTESTAÇÃO";
        if (textoCompleto.includes("RECLAMAÇÃO TRABALHISTA")) return "RECLAMAÇÃO TRABALHISTA";
        if (textoCompleto.includes("AGRAVO DE PETIÇÃO")) return "AGRAVO DE PETIÇÃO";
        if (textoCompleto.includes("AÇÃO DE CONSIGNAÇÃO")) return "AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO";
        if (textoCompleto.includes("MANDADO DE SEGURANÇA")) return "MANDADO DE SEGURANÇA";
        if (textoCompleto.includes("RECURSO DE REVISTA")) return "RECURSO DE REVISTA";
        
        return "IDENTIFICANDO PEÇA...";
    },

    atualizarStatus: (ativo) => {
        const radar = document.getElementById('radar-status');
        if (radar) {
            radar.innerText = ativo ? "RADAR ATIVO" : "RADAR OFF";
            radar.style.borderColor = ativo ? "#fbbf24" : "#ef4444";
            radar.style.color = ativo ? "#fbbf24" : "#ef4444";
        }
    }
};
