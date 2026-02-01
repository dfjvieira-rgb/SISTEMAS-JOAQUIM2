// folha-engine.js - VERSÃO MARGEM BLINDADA OAB [2026-02-01]
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Ajuste de Limite: 75 caracteres é o padrão para não "vazar" a folha
        const LIMITE_OAB = limite || 75;

        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-folha {
                    font-weight: 700 !important;
                    color: #000000 !important;
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-size: 19px !important; 
                    text-transform: uppercase;
                    /* MARGEM DIREITA REAL: impede o texto de colar na borda */
                    padding-right: 60px !important; 
                    box-sizing: border-box;
                }
                .linha-wrapper {
                    background: var(--paper-color);
                    border-bottom: 1px solid var(--line-color);
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="${LIMITE_OAB + 15}" 
                       spellcheck="false" autocomplete="off" data-index="${i}"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            input.addEventListener('input', (e) => {
                const value = input.value;
                
                // Feedback visual de proximidade da margem
                if (value.length >= LIMITE_OAB) input.style.color = "#ef4444";
                else if (value.length >= LIMITE_OAB - 10) input.style.color = "#d97706";
                else input.style.color = "#000000";

                // LÓGICA DE QUEBRA SEM CORTAR PALAVRAS
                if (value.length >= LIMITE_OAB && e.inputType !== 'deleteContentBackward') {
                    const ultimoEspaco = value.lastIndexOf(" ");
                    
                    if (ultimoEspaco > (LIMITE_OAB * 0.6)) {
                        const textoFica = value.substring(0, ultimoEspaco);
                        const textoPula = value.substring(ultimoEspaco).trim();
                        
                        const next = document.getElementById(`L${i + 1}`);
                        if (next) {
                            input.value = textoFica;
                            next.value = textoPula + (next.value ? " " + next.value : "");
                            next.focus();
                        }
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          "; // Parágrafo padrão 10 espaços
                }
                if (e.key === 'Backspace' && input.value === "" && i > 1) {
                    const prev = document.getElementById(`L${i - 1}`);
                    if (prev) {
                        e.preventDefault();
                        prev.focus();
                    }
                }
            });
        }
    }
};
