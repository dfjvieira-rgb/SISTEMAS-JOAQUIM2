export const FolhaEngine = {
    LIMITE_OAB: 60, // Sua margem de segurança absoluta

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { background: #fff; border-bottom: 1px solid #d1d5db; display: flex; height: 35px; position: relative; }
                .linha-wrapper::after { content: ""; position: absolute; right: 60px; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.4); pointer-events: none; }
                .linha-num { width: 40px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #94a3b8; border-right: 1px solid #d1d5db; background: #f8fafc; user-select: none; }
                .linha-folha { 
                    flex: 1; border: none; outline: none; padding: 0 15px; padding-right: 95px !important; 
                    font-size: 19px !important; font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 700 !important; color: #000 !important; letter-spacing: 0.5px;
                    background: transparent;
                }
                @keyframes pulse-discreto { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
                .sync-success { color: #10b981 !important; animation: pulse-discreto 1.5s infinite; font-weight: 900 !important; }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `<div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="95" spellcheck="false" autocomplete="off" data-index="${i}">`;
            container.appendChild(row);

            const input = row.querySelector('input');

            // --- REGRA DE OURO: QUEBRA AUTOMÁTICA NA MARGEM ---
            input.addEventListener('input', (e) => {
                if (e.inputType === 'deleteContentBackward') return;

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

            // --- INTELIGÊNCIA DE NAVEGAÇÃO (ENTER, DELETE, SETAS, BACKSPACE) ---
            input.addEventListener('keydown', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // ENTER: Pula para a linha de baixo
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                // BACKSPACE: Se linha estiver vazia, volta para a anterior
                if (e.key === 'Backspace' && input.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                    }
                }

                // DELETE: Se estiver no fim ou linha vazia, foca na próxima linha para facilitar limpeza
                if (e.key === 'Delete' && input.value === '') {
                    if (proximo) {
                        e.preventDefault();
                        proximo.focus();
                    }
                }

                // SETA PARA CIMA
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (anterior) anterior.focus();
                }

                // SETA PARA BAIXO
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        let currentLinha = linhaInicial;
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        const textoProcessado = limpo.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase());
        const paragrafos = textoProcessado.split('\n');

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
            currentLinha++;
        });
    }
};
