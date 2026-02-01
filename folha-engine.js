// folha-engine.js - VERSÃO TURBO WORD-STYLE
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        for(let i=1; i<=180; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num" title="Clique duplo para revisão" 
                     ondblclick="this.parentElement.style.background = this.parentElement.style.background === 'rgba(251, 191, 36, 0.2)' ? 'transparent' : 'rgba(251, 191, 36, 0.2)'">
                    ${i}
                </div>
                <input class="linha-folha" id="L${i}" maxlength="${limite}" 
                       spellcheck="false" autocomplete="off" 
                       data-index="${i}">
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            // SIMULAÇÃO WORD: Pulo Automático e Validação [cite: 2026-01-30]
            input.addEventListener('input', (e) => {
                const count = input.value.length;
                
                // Feedback visual de cores
                if (count >= 80) input.style.color = "#f87171";
                else if (count >= 70) input.style.color = "#fbbf24";
                else input.style.color = "var(--text-color)";

                // Lógica de Pulo Automático (Flow Style)
                if (count >= limite) {
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) next.focus();
                }
            });

            // Atalho de Parágrafo (3 espaços) [cite: 2026-01-26]
            input.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          "; // Insere o recuo de parágrafo
                }
            });
        }
    }
};
