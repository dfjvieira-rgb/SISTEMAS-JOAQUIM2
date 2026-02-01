// folha-engine.js - VERSÃO TURBO BLINDADA COM NITIDEZ ABNT [2026-02-01]
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // --- INJEÇÃO DE ESTILO ABNT E NITIDEZ ---
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-folha {
                    font-weight: 700 !important; /* Letra Negritada */
                    color: #000000 !important;   /* Preto Puro (ABNT) */
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-size: 19px !important;  /* Tamanho ideal para leitura */
                    letter-spacing: 0.5px;
                    text-transform: uppercase;   /* Estilo padrão de prova */
                    opacity: 1 !important;       /* Garante que não fique apagado */
                }
                .linha-wrapper {
                    background: var(--paper-color);
                    transition: background 0.3s;
                }
                /* Estilo para a margem direita visual */
                .linha-folha:focus {
                    background: rgba(251, 191, 36, 0.05);
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            
            row.innerHTML = `
                <div class="linha-num" title="Clique duplo para revisão" 
                    ondblclick="this.parentElement.style.background = this.parentElement.style.background === 'rgba(251, 191, 36, 0.2)' ? 'transparent' : 'rgba(251, 191, 36, 0.2)'">
                    ${i}
                </div>
                <input class="linha-folha" id="L${i}" maxlength="${limite + 10}" 
                       spellcheck="false" autocomplete="off" 
                       data-index="${i}"
                       style="padding-right: 20px !important;"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            input.addEventListener('input', (e) => {
                const value = input.value;
                const count = value.length;
                
                // 1. Alerta visual de margem (Feedback de Elite)
                if (count >= 80) input.style.color = "#ef4444"; // Vermelho forte
                else if (count >= 70) input.style.color = "#d97706"; // Laranja escuro
                else input.style.color = "#000000";

                // 2. Lógica de Quebra Automática
                if (count >= limite) {
                    const palavras = value.split(" ");
                    const ultimaPalavra = palavras.pop(); 
                    const textoFica = palavras.join(" "); 
                    
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) {
                        input.value = textoFica;
                        next.focus();
                        next.value = ultimaPalavra + (e.data || ""); 
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                // Atalho de Parágrafo (2 espaços = Tab OAB)
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          "; 
                }

                if (e.key === 'Backspace' && input.value === "" && i > 1) {
                    const prev = document.getElementById(`L${i - 1}`);
                    if (prev) {
                        e.preventDefault();
                        prev.focus();
                        const val = prev.value;
                        prev.value = "";
                        prev.value = val;
                    }
                }
            });
        }
    }
};
