// FolhaEngine.js - VERSÃO 100% FUNCIONAL [ENTER + TAB + SETAS]
export const FolhaEngine = {
    LIMITE_OAB: 75, 

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { 
                    background: #fff; 
                    border-bottom: 1px solid #d1d5db; 
                    display: flex; 
                    height: 35px; 
                }
                .linha-num { 
                    width: 45px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.8rem; 
                    color: #64748b; 
                    border-right: 2px solid #cbd5e1; 
                    background: #f1f5f9; 
                    user-select: none; 
                }
                .linha-folha { 
                    flex: 1; 
                    border: none; 
                    outline: none; 
                    padding: 0 15px; 
                    font-size: 18px !important; 
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 600 !important; 
                    color: #000 !important; 
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `<div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" data-index="${i}" spellcheck="false" autocomplete="off">`;
            container.appendChild(row);

            const input = row.querySelector('input');

            // BLOCO DE COMANDOS CRÍTICOS
            input.addEventListener('keydown', function(e) {
                const idx = parseInt(this.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // CORREÇÃO DO TAB (PARÁGRAFO)
                if (e.key === 'Tab') {
                    e.preventDefault(); 
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    // Insere 4 espaços de recuo
                    this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                }

                // CORREÇÃO DO ENTER (PULA LINHA)
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                // NAVEGAÇÃO POR SETAS
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (anterior) anterior.focus();
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                // BACKSPACE NO INÍCIO DA LINHA
                if (e.key === 'Backspace' && this.selectionStart === 0 && this.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        anterior.setSelectionRange(anterior.value.length, anterior.value.length);
                    }
                }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        if (!textoBruto) return;
        let currentLinha = linhaInicial;
        const textoProcessado = textoBruto.replace(/<[^>]*>?/gm, '').split('\n');

        textoProcessado.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";
            palavras.forEach(p => {
                if ((acumulador + p).length > 70) { 
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
