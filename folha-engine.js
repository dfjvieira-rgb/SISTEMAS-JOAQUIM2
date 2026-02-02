// FolhaEngine.js - VERSÃO ELITE PRÁTICA [2026-02-02]
export const FolhaEngine = {
    LIMITE_OAB: 65, // Limite confortável para evitar quebras bruscas

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Injeção de Estilo Otimizado para Visualização e Mobile
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { 
                    background: #fff; 
                    border-bottom: 1px solid #e2e8f0; 
                    display: flex; 
                    height: 32px; 
                    position: relative; 
                }
                /* Margem Direita (Padrão OAB) */
                .linha-wrapper::after { 
                    content: ""; 
                    position: absolute; 
                    right: 40px; 
                    top: 0; 
                    bottom: 0; 
                    width: 1px; 
                    background: rgba(239, 68, 68, 0.2); 
                    pointer-events: none; 
                }
                .linha-num { 
                    width: 35px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.65rem; 
                    color: #94a3b8; 
                    border-right: 2px solid #fbbf24; 
                    background: #f8fafc; 
                    user-select: none; 
                    font-weight: bold;
                }
                .linha-folha { 
                    flex: 1; 
                    border: none; 
                    outline: none; 
                    padding: 0 12px; 
                    font-size: 17px !important; 
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 600 !important; 
                    color: #1e293b !important; 
                    background: transparent;
                    width: 100%;
                }
                /* Destaque para linha ativa */
                .linha-folha:focus { background: #fffbeb; }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="90" 
                       spellcheck="false" autocomplete="off" data-index="${i}">
            `;
            container.appendChild(row);

            const input = row.querySelector('input');

            // INTELIGÊNCIA DE DIGITAÇÃO FLUIDA
            input.addEventListener('input', (e) => {
                if (e.inputType === 'deleteContentBackward') return;
                
                // Quebra automática ao atingir o limite
                if (input.value.length >= FolhaEngine.LIMITE_OAB) {
                    const val = input.value;
                    const lastSpc = val.lastIndexOf(" ");
                    if (lastSpc > 0) {
                        const stays = val.substring(0, lastSpc);
                        const jumps = val.substring(lastSpc).trim();
                        const next = document.getElementById(`L${i + 1}`);
                        if (next) {
                            input.value = stays;
                            next.value = (jumps + " " + next.value).trim();
                            next.focus();
                        }
                    }
                }
            });

            // NAVEGAÇÃO E RECURSOS ESPECIAIS
            input.addEventListener('keydown', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // ENTER: Abre nova linha e empurra o bloco debaixo (Shift Vertical)
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const pos = input.selectionStart;
                    const textoAtual = input.value;
                    const fica = textoAtual.substring(0, pos).trim();
                    const desce = textoAtual.substring(pos).trim();

                    // Shift Vertical: Move tudo para baixo para não perder texto
                    for (let j = 150; j > idx + 1; j--) {
                        const linhaAlvo = document.getElementById(`L${j}`);
                        const linhaAcima = document.getElementById(`L${j - 1}`);
                        if (linhaAlvo && linhaAcima) linhaAlvo.value = linhaAcima.value;
                    }

                    if (proximo) {
                        input.value = fica; 
                        proximo.value = desce; 
                        proximo.focus();
                        proximo.setSelectionRange(0, 0);
                    }
                }

                // BACKSPACE: Inteligência de retorno
                if (e.key === 'Backspace' && input.value === '' && anterior) {
                    e.preventDefault();
                    anterior.focus();
                    const len = anterior.value.length;
                    anterior.setSelectionRange(len, len);
                }

                // ARROW KEYS: Navegação rápida entre linhas
                if (e.key === 'ArrowUp') { e.preventDefault(); anterior?.focus(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); proximo?.focus(); }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        let currentLinha = linhaInicial;
        // Limpeza de HTML e normalização de texto
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        const paragrafos = limpo.split('\n');

        paragrafos.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";
            
            palavras.forEach(p => {
                if ((acumulador + p).length > FolhaEngine.LIMITE_OAB) {
                    const el = document.getElementById(`L${currentLinha}`);
                    if (el) el.value = acumulador.trim();
                    currentLinha++;
                    acumulador = p + " ";
                } else {
                    acumulador += p + " ";
                }
            });
            
            const elFinal = document.getElementById(`L${currentLinha}`);
            if (elFinal) elFinal.value = acumulador.trim();
            currentLinha++; // Salto de parágrafo
        });
    }
};
