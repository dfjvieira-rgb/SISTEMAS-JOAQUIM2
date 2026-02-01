// folha-engine.js - VERSÃO TURBO BLINDADA [cite: 2026-01-30]
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        for(let i=1; i<=180; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            
            // Estilização direta para evitar que letras sumam nas bordas
            row.innerHTML = `
                <div class="linha-num" title="Clique duplo para revisão" 
                     ondblclick="this.parentElement.style.background = this.parentElement.style.background === 'rgba(251, 191, 36, 0.2)' ? 'transparent' : 'rgba(251, 191, 36, 0.2)'">
                    ${i}
                </div>
                <input class="linha-folha" id="L${i}" maxlength="${limite}" 
                       spellcheck="false" autocomplete="off" 
                       data-index="${i}"
                       style="padding-right: 20px !important;"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            // Lógica de Pulo Automático e Cores
            input.addEventListener('input', () => {
                const count = input.value.length;
                
                // Alerta visual de fim de linha
                if (count >= 80) input.style.color = "#f87171";
                else if (count >= 70) input.style.color = "#fbbf24";
                else input.style.color = "inherit";

                // Pulo para a próxima linha
                if (count >= limite) {
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) next.focus();
                }
            });

            // Atalho de Parágrafo (3 espaços rápidos)
            input.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          "; 
                }
            });
        }
    }
};
