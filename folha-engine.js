// folha-engine.js - VERSÃO ESTÉTICA OAB FINAL [2026-02-01]
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const LIMITE_OAB = limite || 75;

        // --- INJEÇÃO DE ESTILO COM MARGEM VERTICAL ---
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper {
                    background: var(--paper-color);
                    border-bottom: 1px solid var(--line-color);
                    position: relative; /* Necessário para a linha absoluta */
                    display: flex;
                }
                /* A LINHA DA MARGEM DIREITA */
                .linha-wrapper::after {
                    content: "";
                    position: absolute;
                    right: 60px; /* Alinhado com o padding do input */
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: rgba(239, 68, 68, 0.3); /* Vermelho sutil */
                    pointer-events: none;
                }
                .linha-num {
                    width: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    border-right: 1px solid var(--line-color);
                    background: #f8fafc;
                    user-select: none;
                }
                .linha-folha {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent !important;
                    padding: 0 10px;
                    padding-right: 65px !important; /* Texto para antes da linha */
                    font-size: 19px !important;
                    font-family: 'Courier New', Courier, monospace !important;
                    font-weight: 700 !important;
                    color: #000000 !important;
                    text-transform: uppercase;
                    height: 35px;
                    box-sizing: border-box;
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="${LIMITE_OAB + 10}" 
                       spellcheck="false" autocomplete="off" data-index="${i}"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            input.addEventListener('input', (e) => {
                const value = input.value;
                
                // Lógica de quebra automática para respeitar a margem
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
                // Parágrafo (2 espaços = 10 espaços)
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          ";
                }
                // Backspace inteligente
                if (e.key === 'Backspace' && input.value === "" && i > 1) {
                    const prev = document.getElementById(`L${i - 1}`);
                    if (prev) {
                        e.preventDefault();
                        prev.focus();
                    }
                }
                // Enter para próxima linha
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) next.focus();
                }
            });
        }
    }
};
